import { Injectable, NotFoundException } from '@nestjs/common';

// import { Rate } from './rate.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import * as nodemailer from 'nodemailer';
import { Telegraf } from 'telegraf';
import { getEcoCashRate } from './axios.service';

@Injectable()
export class RateService {
  constructor(
    // @InjectRepository(Rate)
    // private readonly rateRepository: Repository<Rate>,
  ) {
    // Start monitoring the rate every minute when the service is created
    // setInterval(this.monitorRate.bind(this), 60 * 1000);
  }

  // async getCurrentRate(): Promise<{ rate: number, timestamp: Date }> {
  //   const latestRate = await this.rateRepository.findOne({
  //     order: { timestamp: 'DESC' },
  //   });

  //   if (!latestRate) {
  //     throw new NotFoundException('No rates found');
  //   }

  //   return { rate: latestRate.rate, timestamp: latestRate.timestamp };
  // }

  // async getTodayRates(): Promise<number[]> {
  //   const todayRates = await this.rateRepository.find({
  //     where: {
  //       timestamp: new Date().toISOString().slice(0, 10),
  //     },
  //   });

  //   if (todayRates.length === 0) {
  //     throw new NotFoundException('No rates found for today');
  //   }

  //   return todayRates.map(rate => rate.rate);
  // }

  async getRata():Promise<any>{
    const response = await getEcoCashRate(5000);
    console.log(response.data);
    
    return response.data
  }
  private async monitorRate() {
    try {
      // Call the endpoint that returns the rate
      const response = getEcoCashRate(5000);
    
      const newRate = response;

      // Get the latest rate from the database
      const latestRate = {rate: 2300}
      //   const latestRate = await this.rateRepository.findOne({
      //   order: { timestamp: 'DESC' },
      // });

      // Check if the new rate is different from the latest rate in the database
      // if (!latestRate || newRate !== latestRate.rate) {
        // Save the new rate to the database
        // await this.rateRepository.save({ rate: newRate });

      //   // Send an email notification
      //   const transporter = nodemailer.createTransport({
      //     host: 'smtp.example.com',
      //     port: 587,
      //     auth: {
      //       user: 'user@example.com',
      //       pass: 'password',
      //     },
      //   });

      //   const mailOptions = {
      //     from: 'sender@example.com',
      //     to: 'recipient1@example.com, recipient2@example.com',
      //     subject: 'Rate Change',
      //     text: `The rate has changed to ${newRate}.`,
      //   };

      //   await transporter.sendMail(mailOptions);

      //   // Send a Telegram notification
      //   const bot = new Telegraf('TELEGRAM_BOT_TOKEN');

      //   await bot.sendMessage('TELEGRAM_CHAT_ID', `The rate has changed to ${newRate}.`);
      // }
    } catch (error) {
      console.error('Error monitoring rate:', error.message);
    }
  }
}



// how to telegram

// create rds

//