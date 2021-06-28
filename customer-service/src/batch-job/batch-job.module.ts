import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from 'src/customer/models/customer.entity';
import { BatchJobService } from './batch-job.service';

@Module({
  imports: [TypeOrmModule.forFeature([CustomerEntity])],
  providers: [BatchJobService],
})
export class BatchJobModule {}
