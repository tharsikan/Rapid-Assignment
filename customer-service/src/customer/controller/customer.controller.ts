import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CustomerI } from '../models/customer.interface';
import { CustomerService } from '../service/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private customerService: CustomerService) {}

  @Post()
  async add(@Body() customer: CustomerI): Promise<Observable<CustomerI>> {
    return this.customerService.add(customer);
  }

  @Get()
  findAll(): Observable<CustomerI[]> {
    return this.customerService.findAll();
  }

  // @Get()
  // async getAllCSV() {
  //   console.log('hello am i working');
  //   return this.customerService.getFromCSV();
  // }
}
