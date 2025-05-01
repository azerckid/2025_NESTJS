import { Injectable } from '@nestjs/common';
import { Movie } from './entities/movie.entity';

@Injectable()
export class MoviesService {
    private movies: Movie[] = [];

    getAll(): Movie[] {
        return this.movies;
    }
    getOne(id: string): Movie {
        return this.movies.find(movie => movie.id === +id);
    }
    search(year: string) {
        return this.movies.filter(movie => movie.year === +year);
    }

    deleteOne(id: string): boolean {
        this.movies = this.movies.filter(movie => movie.id !== +id);
        return true;
    }

    create(movieData) {
        this.movies.push({
            id: this.movies.length + 1,
            ...movieData
        });
    }

    update(id: string, updateData) {
        const movie = this.getOne(id);
        this.deleteOne(id);
        this.movies.push({ ...movie, ...updateData });
    }

}
