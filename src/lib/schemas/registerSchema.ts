import { z} from 'zod'

export const registerSchema = z.object({
    fullName:z.string().min(1).max(50),
    email:z.email(),    
    password:z.string().min(6,{error:'Password must be between 6 and 100 charachters'}).max(100)
})

export type RegisterSchema = z.infer<typeof registerSchema>