module.exports = {
    port : 3000,
    session : {
        secret : 'chjblog',
        key : 'chjblog',
        maxAge: 2592000000
    },
    mongodb : 'mongodb://localhost:27017/chjblog'
}