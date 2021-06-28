import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/customer/models/customer.entity';
import { Repository } from 'typeorm';
import * as Bull from 'bull';
import { CustomerI } from 'src/customer/models/customer.interface';
import * as csv from 'csv-parser';
import * as fs from 'fs';
import * as path from 'path';
import { from, Observable } from 'rxjs';

@Injectable()
export class BatchJobService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {
    this.importCustomersFromCSV();
    this.customerQueue.process(this.customerProcess);
  }
  importCustomersFromCSV() {
    const results = [];
    const jsonPath = path.join(__dirname, '../..', 'assets', 'customer.csv');
    return new Promise((resolve, reject) =>
      fs
        .createReadStream(jsonPath)
        .on('error', (error) => reject(error))
        .pipe(csv())
        .on('data', (data) => {
          data.manufactured_date = new Date(data.manufactured_date);
          data.age = this.getAge(data.manufactured_date);
          this.importCustomer(data);
        })
        .on('end', () => resolve(results)),
    );
  }
  getAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
  customerQueue = new Bull('customer', {
    redis: process.env.REDIS_URL,
  });
  add(customer: CustomerI): Observable<CustomerI> {
    return from(this.customerRepository.save(customer));
  }
  customerProcess = async (job: Bull.Job) => {
    this.add(job.data);
  };

  importCustomer = (customer: CustomerI) => {
    this.customerQueue.add(customer, {});
  };
}
