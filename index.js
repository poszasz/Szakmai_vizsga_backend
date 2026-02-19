const express = require('express')
const cors = require('cors')
const cookieparser = require('cookie-parser')
const mysql = require('mysql2/promise')
const jwt = require('jsonwebtoken')
const emailValidator = require('node-email-verifier')
const bcrypt = require('bcrypt')


// config
const PORT = 3000;
const HOST = 'localhost'
const JWT_SECRET = 'valami_jelszo'
const JWT_EXPIRES_IN = '7d'
const COOKIE_NAME = 'auth-token'


// cookie beállítás
const COOKIE_OPTS = {
    httpOnly: true,
    secure: false,
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60 * 1000,
}

// adatbázis beáálítás
const db = mysql.createPool({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'project'
})

//Middleware
function auth(req, res, next) {
    const token = req.cookies[COOKIE_NAME]
    if (!token) {
        return res.status(409).json({ message: "Nem vagy bejelentkezve" })
    } try {
        //tokenbol kinyerni a felhasznaloi adatokat
        req.user = jwt.verify(token, JWT_SECRET)
        next(); //haladhat tovabb a vegpontban
    } catch (error) {
        return res.status(410).json({ message: "Nem érvényes token" })
    }
}