export class HttpService {

    private fetchOptions: RequestInit;

    public constructor(
        private baseUrl: string, 
        private username: string,
        private password: string) {
            const basicAuth = window.btoa(`${username}:${password}`);

            this.fetchOptions = {
                headers: {
                    'Authorization': `Basic ${basicAuth}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
            }
        }


    public post(path: string, body: any): Promise<any> {
        const options = {
            ...this.fetchOptions,
            method: 'POST',
            body: JSON.stringify(body),
        }

        return fetch(this.baseUrl + path, options)
            .then(
                (response) => {
                    if (!response.ok) {
                        throw new Error('Error processing post response');
                    }

                    return response.text();
                }
            )
            .then((body) => JSON.parse(body));
    }
}