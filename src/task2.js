import fs from "fs";
import csvToJson from "csvtojson";
import stream from "stream";

const CSV_FILE_PATH = "./csv/node_mentoring_t1_2_input_example.csv";
const writeStream = fs.createWriteStream("./txt/converted_csv.txt");

stream.pipeline(
    csvToJson({
        colParser: {
            price: "number",
            amount: "omit"
        },
        headers: ["book", "author", "amount", "price"],
        checkType: true
    }).fromFile(CSV_FILE_PATH),
    writeStream,
    (err) => {
        if (err) {
            console.error("Ups. Something went wrong!.", err);
        } else {
            console.log("File was converted fully.");
        }
    }
);
