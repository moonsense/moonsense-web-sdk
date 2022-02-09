interface Config {
    authUsername: string;
    authPassword: string;
    postBaseUrl: string;
    bundleCreated: (session: AcmeSession, bundleId: number) => void;
}