import { User, UserService } from "./UserService";

describe('UserService', () => {
    const mockDb: User[] = []
    const userService = new UserService(mockDb);

    it('Deve adicionar um novo usuário', () => {
        const mockConsole = jest.spyOn(global.console, 'log')
        userService.createUser('nath', 'nath@test.com');
        expect(mockConsole).toHaveBeenCalledWith('DB atualizado', mockDb)
    })

    it('Deve remover um usuário existente', () => {
        const mockConsole = jest.spyOn(global.console, 'log')
        const result = userService.deleteUser('nath@test.com')
        expect(result).toBe(true)
        expect(mockConsole).toHaveBeenCalledWith('Usuário removido', [])
    })

    it('Deve falhar ao tentar remover um usuário inexistente', () => {
        const result = userService.deleteUser('inexistente@test.com')
        expect(result).toBe(false)
    })
})