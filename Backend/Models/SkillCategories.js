const express = require('express');
const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
    title: { type: String, required: true },
    iconBg: { type: String, required: true },
    iconUrl: { type: String, required: true },
})

const SkillCategories = mongoose.model('SkillCategories', Schema)

module.exports = SkillCategories;