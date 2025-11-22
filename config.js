import * as dotenv from 'dotenv';
dotenv.config();

export const config = {
    prefix: '+',
    redColor: '#FF0000',
    greenColor: '#00FF00',
    blueColor: '#0099FF',
    orangeColor: '#FFA500',
    token: process.env.DISCORD_TOKEN
};

export const redColor = config.redColor;
export const greenColor = config.greenColor;
export const blueColor = config.blueColor;
export const orangeColor = config.orangeColor;
export const token = config.token;