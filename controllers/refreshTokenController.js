const User = require('../model/User');
const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(401);
    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', {httpOnly: true, sameSite: 'None', secure: true});

    const foundUser = await User.findOne({ refreshToken }).exec();
    // wykryto ponowne użycie tokena odświeżania
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async(err, decoded)=>{
                if(err) return res.sendStatus(403);//Forbidden
                console.log('wypróbowano ponowne użycie tokena odświerzającego!')
                const hackedUser=await User.findOne({username: decoded.username}).exec();
                hackedUser.refreshToken=[];
                const result=await hackedUser.save();
                console.log(result);
            }
        )
        return res.sendStatus(403);//Forbidden 
    }

    const newRefreshTokenArray=foundUser.refreshToken.filter(rt=>rt !==refreshToken);

    // evaluate jwt 
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if(err){
                console.log('expire refresh token')
                foundUser.refreshToken=[...newRefreshTokenArray];
                const result =await foundUser.save();
                console.log(result);
            }
            if (err || foundUser.username !== decoded.username) return res.sendStatus(403);
            // Odświerzanie tokena było wciąż ważne
            const roles = Object.values(foundUser.roles);
            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '10s' }
            );
            const newRefreshToken = jwt.sign(
                { "username": foundUser.username },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: '1d' }
            );
            // zapisywanie refreshToken z obecnym użytkownikiem
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            const result = await foundUser.save();
            // tworzenie Cookie z refresh token
            res.cookie('jwt', newRefreshToken, { httpOnly: true, secure: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000 });
            res.json({ roles, accessToken })
        }
    );
}

module.exports = { handleRefreshToken }