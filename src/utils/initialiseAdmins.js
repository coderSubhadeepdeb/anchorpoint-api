import { Admin } from "../models/admin.model.js";
import mongoose from "mongoose";

const initialiseAdmins = async() => {
    try{
        const usernames = process.env.ADMIN_USERNAMES?.split(',') || [];
        const emails = process.env.ADMIN_EMAILS?.split(',') || [];
        const passwords = process.env.ADMIN_PASSWORDS?.split(',') || [];

        if (usernames.length !== emails.length || usernames.length !== passwords.length) {
            throw new Error('ADMIN_USERNAMES, ADMIN_EMAILS, and ADMIN_PASSWORDS must have the same number of entries');
        }

        for(let i = 0 ; i < usernames.length ; i++){
            const username = usernames[i].trim().toLowerCase();
            const email = emails[i].trim().toLowerCase();
            const password = passwords[i];

            try{
                const existedUser = await Admin.findOne({ $or: [{ username }, { email }] });

                if(!existedUser){
                    try{
                        const admin = await Admin.create({
                            username,
                            email,
                            password
                        })
                        console.log(`Admin created with username: ${username}`);
                    }catch(err){
                        console.error("Error occcured while creating the admin:", err);
                    }
                }else{
                    console.log(`Admin already exist with username: ${username}`);
                }
            }catch(err){
                console.error(`Failed to process admin with username: ${username}`,err);
            }

        }
    }catch(err){
        console.error('Failed to initialize admins:', err);
    }
}

export default initialiseAdmins;