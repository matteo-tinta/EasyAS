export type LoginPresentationDto = {
    username: string,
    password: string,
}

export type RenewTokenRequestDto = {
    username: string,
    refresh_token: string
}