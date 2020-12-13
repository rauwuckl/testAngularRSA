export interface SchoolClassTransport{
    id: string;
    name: string;
    classSecret: string;
    publicKey: string;
}

export interface ClassTeacherTransport{
    classSecret: string;
    private: string;
    public: string;
}

export interface EncMessage{
    encrypted: string;
    hash: string;
    decrypted?: string;
}