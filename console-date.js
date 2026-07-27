#!/usr/bin/env node

const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

//для изменения даты
function addTime(date, amount, unit) {
    const d = new Date(date);
    switch (unit) {
        case 'years':
            d.setFullYear(d.getFullYear() + amount);
            break;
        case 'months':
            d.setMonth(d.getMonth() + amount);
            break;
        case 'days':
            d.setDate(d.getDate() + amount);
            break;
    }
    return d;
}

yargs(hideBin(process.argv))
    .command(
        'current',
        'Получить текущую дату/время',
        (yargs) => {
            return yargs
                .option('year', { alias: 'y', type: 'boolean', description: 'Текущий год' })
                .option('month', { alias: 'm', type: 'boolean', description: 'Текущий месяц (1-12)' })
                .option('date', { alias: 'd', type: 'boolean', description: 'Текущий день месяца' })
                .conflicts('year', 'month')   // Опции взаимоисключающие
                .conflicts('year', 'date')
                .conflicts('month', 'date');
        },
        (argv) => {
            const now = new Date();
            if (argv.year) {
                console.log(now.getFullYear());
            } else if (argv.month) {
                console.log(now.getMonth() + 1); // Месяцы в Date нумеруются с 0
            } else if (argv.date) {
                console.log(now.getDate());
            } else {
                console.log(now.toISOString());
            }
        }
    )
    .command(
        'add',
        'Добавить интервал к текущей дате и вывести ISO',
        (yargs) => {
            return yargs
                .option('days', { alias: 'd', type: 'number', description: 'Количество дней' })
                .option('months', { alias: ['m', 'month'], type: 'number', description: 'Количество месяцев' })
                .option('years', { alias: ['y', 'year'], type: 'number', description: 'Количество лет' })
                .check((argv) => {
                    if (argv.days === undefined && argv.months === undefined && argv.years === undefined) {
                        throw new Error('Укажите хотя бы одну опцию: --days, --months, --years');
                    }
                    return true;
                });
        },
        (argv) => {
            let date = new Date();
            if (argv.days !== undefined) date = addTime(date, argv.days, 'days');
            if (argv.months !== undefined) date = addTime(date, argv.months, 'months');
            if (argv.years !== undefined) date = addTime(date, argv.years, 'years');
            console.log(date.toISOString());
        }
    )
    .command(
        'sub',
        'Вычесть интервал из текущей даты и вывести ISO',
        (yargs) => {
            return yargs
                .option('days', { alias: 'd', type: 'number', description: 'Количество дней' })
                .option('months', { alias: ['m', 'month'], type: 'number', description: 'Количество месяцев' })
                .option('years', { alias: ['y', 'year'], type: 'number', description: 'Количество лет' })
                .check((argv) => {
                    if (argv.days === undefined && argv.months === undefined && argv.years === undefined) {
                        throw new Error('Укажите хотя бы одну опцию: --days, --months, --years');
                    }
                    return true;
                });
        },
        (argv) => {
            let date = new Date();
            // Вычитание – добавление с отрицательным знаком
            if (argv.days !== undefined) date = addTime(date, -argv.days, 'days');
            if (argv.months !== undefined) date = addTime(date, -argv.months, 'months');
            if (argv.years !== undefined) date = addTime(date, -argv.years, 'years');
            console.log(date.toISOString());
        }
    )
    .demandCommand(1, 'Укажите команду: current, add или sub')
    .help()
    .argv;