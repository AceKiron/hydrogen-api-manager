module.exports = async ({ router, WARN }) => {
    router.get("/ping", (req, res) => {
        res.send("Pong!");
    });

    WARN("This is just the example module");
}