// src/controllers/UserController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { ObjectId } from "mongodb";

export class UserController {
    static async register(req: Request, res: Response) {
        const { name, email, password, role, phone, city, country } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).send("All fields are required.");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User();
        user.name = name;
        user.email = email;
        user.password = hashedPassword;
        user.role = role;
        user.phone = phone;
        user.city = city;
        user.country = country;

        try {
            await AppDataSource.manager.save(user);
            res.status(201).json({ message: "User  registered successfully." });
        } catch (error) {
            res.status(500).json({ message: "Error registering user", error });
        }
    }

    static async login(req: Request, res: Response) {
        const { email, password } = req.body;

        const user = await AppDataSource.manager.findOne(User, { where: { email } });
        if (!user) return res.status(400).send("Invalid email or password.");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send("Invalid email or password.");

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.json({ token });
    }

    static async listUsers(req: Request, res: Response) {
        if (req.user.role !== "Admin") return res.status(403).send("Access denied.");

        const { name, email, country } = req.query;
        const queryOptions = {
            where: {},
        };

        try {
            const users = await AppDataSource.manager.find(User, queryOptions);
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error loading users", error });
        }
    }

    static async userDetails(req: Request, res: Response) {
        const userId = req.params.id;

        // Validate ObjectId format
        if (!ObjectId.isValid(userId)) {
            return res.status(400).send("Invalid user ID format.");
        }

        try {
            // Convert userId to ObjectId
            const userObjectId = new ObjectId(userId);

            const user = await AppDataSource.manager.findOne(User, { where: { id: userObjectId } });
            if (!user) return res.status(404).send("User  not found.");

            if (req.user.role === "User " && req.user.id !== userId) {
                return res.status(403).send("Access denied.");
            }

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: "Error retrieving user details", error });
        }
    }

    static async searchUsers(req: Request, res: Response) {
        const { name, email } = req.query;

        const queryOptions: any = {
            where: {},
        };
    
        if (name) {
            queryOptions.where.name = name;
        }
    
        if (email) {
            queryOptions.where.email = email;
        }
    
        try {
            const users = await AppDataSource.manager.find(User, queryOptions);
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error searching users", error });
        }
    }

    static async filterUsersByCountry(req: Request, res: Response) {
        const { country } = req.query;
    
        if (!country) {
            return res.status(400).send("Country parameter is required.");
        }
    
        try {
            const users = await AppDataSource.manager.find(User, {
                where: { country: country },
            });
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: "Error filtering users", error });
        }
    }
}
