import { UserController } from "./UserController";
import { UserService } from '../services/UserService'
import { Request } from 'express'
import { makeMockResponse } from "../__mocks__/mockResponse.mock";

describe('UserController', () => {
    const mockUserService: Partial<UserService> = {
        createUser: jest.fn(),
        getAllUsers: jest.fn().mockReturnValue([
            {
                name: 'Nath',
                email: 'nath@test.com'
            }
        ]),
        deleteUser: jest.fn()
    }
    
    const userController = new UserController(mockUserService as UserService);

    it('Deve adicionar um novo usuário', () => {
        const mockRequest = {
            body: {
                name: 'Nath',
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(201)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário criado' })
    })

    it('Deve retornar erro quando o nome não for informado', () => {
        const mockRequest = {
            body: {
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Name obrigatório' })
    })

    it('Deve retornar erro quando o email não for informado', () => {
        const mockRequest = {
            body: {
                name: 'Nath'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.createUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Email obrigatório' })
    })

    it('Deve chamar a função getAllUsers', () => {
        const mockRequest = {} as Request
        const mockResponse = makeMockResponse()
        userController.getAllUsers(mockRequest, mockResponse)
        expect(mockUserService.getAllUsers).toHaveBeenCalled()
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toEqual([
            {
                name: 'Nath',
                email: 'nath@test.com'
            }
        ])
    })

    // Testes para o método deleteUser
    it('Deve deletar um usuário existente', () => {
        (mockUserService.deleteUser as jest.Mock).mockReturnValueOnce(true)
        const mockRequest = {
            body: {
                email: 'nath@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        expect(mockUserService.deleteUser).toHaveBeenCalledWith('nath@test.com')
        expect(mockResponse.state.status).toBe(200)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário deletado com sucesso' })
    })

    it('Deve retornar erro quando o email não for informado para deletar', () => {
        const mockRequest = {
            body: {}
        } as Request
        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        expect(mockResponse.state.status).toBe(400)
        expect(mockResponse.state.json).toMatchObject({ message: 'Bad request! Email obrigatório para deletar usuário' })
    })

    it('Deve retornar 404 ao tentar deletar um usuário inexistente', () => {
        (mockUserService.deleteUser as jest.Mock).mockReturnValueOnce(false)
        const mockRequest = {
            body: {
                email: 'inexistente@test.com'
            }
        } as Request
        const mockResponse = makeMockResponse()
        userController.deleteUser(mockRequest, mockResponse)
        expect(mockUserService.deleteUser).toHaveBeenCalledWith('inexistente@test.com')
        expect(mockResponse.state.status).toBe(404)
        expect(mockResponse.state.json).toMatchObject({ message: 'Usuário não encontrado' })
    })
})