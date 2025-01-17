import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsBoolean } from 'class-validator';

export enum FieldTypeEnum {
  Checkbox = 'CHECKBOX',
  Dropdown = 'DROPDOWN',
  Number = 'NUMBER',
  Password = 'PASSWORD',
  Radio = 'RADIO',
  Text = 'TEXT',
  Textarea = 'TEXTAREA',
}

export class CreateFieldDefinitionDto {
  @ApiProperty({
    type: 'string',
    example: 'citizenshipNumber',
  })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({
    type: 'string',
    example: 'TEXT',
    description:
      'Valid data types:  CHECKBOX/DROPDOWN/NUMBER/PASSWORD/RADIO/TEXT/TEXTAREA',
  })
  @IsString()
  @IsNotEmpty()
  fieldType!: FieldTypeEnum;

  @ApiProperty({
    type: 'boolean',
    example: true,
  })
  @IsBoolean()
  isActive!: boolean;

  @ApiProperty({
    type: 'boolean',
    example: false,
  })
  @IsBoolean()
  isTargeting!: boolean;

  @ApiProperty({
    type: 'object',
    example: {
      data: [
        { key: 'yes', value: 'Yes' },
        { key: 'no', value: 'No' },
      ],
    },
  })
  @IsOptional()
  fieldPopulate: any;
}
