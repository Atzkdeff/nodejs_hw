process.stdin.setEncoding("utf8");

process.stdin.on("readable", () => {
    let chunk;
    // Use a loop to make sure we read all available data.
    while ((chunk = process.stdin.read()) !== null) {
        process.stdout.write(
            chunk
                .split("")
                .slice(0, -2)
                .reverse()
                .join("") + "\r\n"
        );
    }
});
