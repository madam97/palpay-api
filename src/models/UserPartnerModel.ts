import { Model } from './Model';
import { bankAccountModel } from './BankAccountModel';
import { userInfoModel } from './UserInfoModel';
import db from '../database';
import IObject from '../interfaces/IObject';

export interface Partner {
  id: number,
  userId: number,
  name: string,
  accountNumber: string,
  nickname?: string | null
};

interface PartnerRow {
  id: number,
  userId: number,
  partnerUserId: number,
  nickname?: string | null
};

class UserPartnerModel extends Model<Partner> {

  constructor() {
    super({
      userId: {
        required: true
      },
      name: {
        required: true
      },
      accountNumber: {
        required: true
      },
      nickname: {
        required: false
      }
    });
  }

  public format(data: IObject): Partner {
    return {
      id: data.id,
      userId: data.user_id ?? data.userId,
      name: data.name,
      accountNumber: data.account_number ?? data.accountNumber,
      nickname: data.nickname ?? data.name
    };
  }

  public formatRow(data: IObject): PartnerRow {
    return {
      id: data.id,
      userId: data.user_id ?? data.userId,
      partnerUserId: data.partner_user_id ?? data.partnerUserId,
      nickname: data.nickname
    };
  }

  private async getEntityFromRow(partnerRow: PartnerRow): Promise<Partner> {
    const bankAccount = await bankAccountModel.findOneByUserId(partnerRow.partnerUserId);
    const userInfo = await userInfoModel.findOneByUserId(partnerRow.partnerUserId);

    return {
      id: partnerRow.id,
      userId: partnerRow.userId,
      name: userInfo.name,
      accountNumber: bankAccount.accountNumber,
      nickname: partnerRow.nickname
    };
  }

  private async getRowFromEntity(partner: Partner): Promise<PartnerRow> {
    const bankAccount = await bankAccountModel.findOneByAccountNumber(partner.accountNumber);
    const userInfo = await userInfoModel.findOneByUserId(bankAccount.userId);

    return {
      id: partner.id,
      userId: partner.userId,
      partnerUserId: bankAccount.userId,
      nickname: partner.nickname ?? null
    };
  }


  
  /// OPERATION METHODS

  public async findByUserId(userId: number): Promise<Partner[]> {
    return this.formatArray( await db.select(`${this.NAME}/select`, [userId]) );
  }

  public async findOne(id: number): Promise<Partner> {
    return await this.getEntityFromRow( this.formatRow( await db.selectOne(`${this.NAME}/selectOne`, id) ) );
  }

  public async create(partner: Partner): Promise<Partner> {
    this.validate(partner, 'POST');

    const partnerRow = await this.getRowFromEntity(partner);

    partner.id = await db.insert(`${this.NAME}/insert`, this.toArraySimple(partnerRow, true));

    return partner;
  }

  public async update(partner: Partner): Promise<boolean> {
    this.validate(partner, 'PUT');

    const partnerRow = await this.getRowFromEntity(partner);

    return await db.update(`${this.NAME}/update`, this.toArraySimple(partnerRow));
  }

}

export const userPartnerModel = new UserPartnerModel();