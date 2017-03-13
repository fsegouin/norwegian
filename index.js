#!/usr/bin/env node
'use strict'

const osmosis = require('osmosis')
const chalk = require('chalk')
const jsonfile = require('jsonfile')
const _ = require('underscore')
const file = '/data/output.json'

const json = jsonfile.readFileSync(file)

// Fares
var fares = {'outbound': [], 'inbound': []}

const now = new Date().toISOString()

osmosis
    .get('https://www.norwegian.com/uk/booking/flight-tickets/farecalendar/?A_City=FLL&AdultCount=2&ChildCount=0&CurrencyCode=GBP&D_City=LGW&D_Day=04&D_Month=201709&IncludeTransit=true&InfantCount=0&R_Day=11&R_Month=201709&TripType=2')
    .find('[id^="OutboundFareCal"]')
    .set({
        'price': '.fareCalPrice',
        'date': '.fareCalDate'
    })
    .data((result) => {
        fares.outbound.push(result)
    })
    .done(() => {
        osmosis
            .get('https://www.norwegian.com/uk/booking/flight-tickets/farecalendar/?A_City=FLL&AdultCount=2&ChildCount=0&CurrencyCode=GBP&D_City=LGW&D_Day=04&D_Month=201709&IncludeTransit=true&InfantCount=0&R_Day=11&R_Month=201709&TripType=2')
            .find('[id^="InboundFareCal"]')
            .set({
                'price': '.fareCalPrice',
                'date': '.fareCalDate'
            })
            .data((result) => {
                fares.inbound.push(result)
            })
            .done(() => {
              const lowestOutbound = _.min(fares.outbound, o  => o.price)
              const lowestInbound = _.min(fares.inbound.filter(o => parseInt(o.date) <= parseInt(lowestOutbound.date) + 10), o => o.price)
              console.log('Fly out:', chalk.blue(lowestOutbound.date))
              console.log('Fly back:', chalk.blue(lowestInbound.date))
              console.log('Lowest outbound fare so far:', chalk.green('£' + lowestOutbound.price))
              console.log('Lowest inbound fare so far:', chalk.green('£' + lowestInbound.price))
              const result = {'timestamp': now, 'outbound': {'date': lowestOutbound.date, 'price': lowestOutbound.price}, 'inbound': {'date': lowestInbound.date, 'price': lowestInbound.price}}
              var jsonOutput = jsonfile.readFileSync(file)
              jsonOutput.push(result)
              jsonfile.writeFileSync(file, jsonOutput)
            })
    })
