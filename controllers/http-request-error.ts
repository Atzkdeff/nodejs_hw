export class HttpRequestError extends Error {
    /**
     * Status code
     */
    public status: number;

    constructor(status: number, message: string) {
        super(message);

        this.status = status;
    }
}
