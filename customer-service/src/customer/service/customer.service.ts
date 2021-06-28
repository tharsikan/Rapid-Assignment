import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Repository } from 'typeorm';
import { CustomerEntity } from '../models/customer.entity';
import { CustomerI } from '../models/customer.interface';

@Injectable()
export class CustomerService {
  constructor(
    @InjectRepository(CustomerEntity)
    private customerRepository: Repository<CustomerEntity>,
  ) {}

  add(customer: CustomerI): Observable<CustomerI> {
    return from(this.customerRepository.save(customer));
  }

  findAll(): Observable<CustomerI[]> {
    return from(this.customerRepository.find());
  }
}
