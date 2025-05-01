import { IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateMovieDto {

    @IsString()
    readonly title: string;

    @IsNumber()
    readonly year: number;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    readonly genres: string[];
}