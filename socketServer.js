module.exports = function (io) {
    var users = [];
    io.of('/chat').on('connection', function (socket) {
        console.log('New Session -------------------');
        socket.on('connectUser', function (data) {
            console.log('User connected => ' + data.username + " / ID => " + socket.id);
            users[socket.id] = data.username;
            socket.broadcast.emit("userconnected", data.username + " is connected");
        });
        socket.on('disconnect', function () {
            console.log('User disconnected => ' + users[socket.id] + " / ID => " + socket.id);
        });

        //-------------------------------------------------------------------------------------------------------------

        socket.on('say', function (data) {
            console.log("\n\t" + data.username + " : " + data.text);
            socket.broadcast.emit('send', data);
        })

    });
};
