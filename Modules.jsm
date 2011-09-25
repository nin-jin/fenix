"use strict"

// Автозагрузка модулей из указанной директории
// Использование:
// let my = Modules(this); // загружать модули из текущей директории
// let api = new my.api; // загрузить модуль api.jsm, и взять из него значение глобальной переменной api
// let common = my.$follow("../common/"); // а другие модули будем грузить из соседней директории
// let file = new common.File; // конструктор будет взят из модуля ../common/File.jsm

const EXPORTED_SYMBOLS = ["Modules"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;
const Cu = Components.utils;

