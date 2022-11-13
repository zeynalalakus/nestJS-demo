import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateReportDto } from "./dtos/create-report.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Report } from "./report.entity";
import { Repository } from "typeorm";
import { User } from "../users/user.entity";
import { ApproveReportDto } from "./dtos/approve-report.dto";
import { GetEstimateDto } from "./dtos/get-estimate.dto";

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Report) private readonly repository: Repository<Report>) {}

  create(reportDto: CreateReportDto, user: User) {
    const report = this.repository.create(reportDto);
    report.user = user;
    return this.repository.save(report);
  }

  async changeApproval(id: number, approved: boolean) {
    const report = await this.repository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report Not Found')
    }
    report.approved = approved;
    return this.repository.save(report);
  }

  async getReportById(id: number) {
    const report = await this.repository.findOne({ where: { id } });
    if (!report) {
      throw new NotFoundException('Report Not Found')
    }
    return report;
  }

  async getEstimate({ make, model, lng, lat, year, mileage }: GetEstimateDto) {
    return await this.repository.createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', {make})
      .andWhere('model = :model', {model})
      .andWhere('lng - :lng BETWEEN -5 AND 5', {lng})
      .andWhere('lat - :lat BETWEEN -5 AND 5', {lat})
      .andWhere('year - :year BETWEEN -3 AND 3', {year})
      .andWhere('approved IS TRUE')
      .orderBy('mileage - :mileage', 'DESC')
      .setParameters({mileage})
      .limit(3)
      .getRawOne()
  }
}
