export interface IAuthProvider {
    sign(payload: object): object;
}