const auth_JWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
            if (err) {
                return res.sendStatus(401);
            } req.user = user; next();
        });
    } else {
        res.sendStatus(401); router.use((req, res) => { res.status(404).sendFile('./views/404.html', { root: __dirname }); }
        );
    }
};

module.exports = {
    auth_JWT
}