import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

describe('MoviesService', () => {
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MoviesService],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an empty array', () => {
      const result = service.getAll();
      expect(result).toEqual([]);
    });

    it('should return an array of movies', () => {
      // 먼저 영화를 생성
      service.create({
        title: 'Test Movie',
        year: 2025,
        genres: ['test']
      });

      const movies = service.getAll();
      expect(movies).toHaveLength(1);
      expect(movies[0].title).toBe('Test Movie');
    });
  });

  describe('getOne', () => {
    it('should return a movie', () => {
      // 먼저 영화를 생성
      service.create({
        title: 'Test Movie',
        year: 2025,
        genres: ['test']
      });

      const movie = service.getOne(1);
      expect(movie).toBeDefined();
      expect(movie.title).toBe('Test Movie');
    });

    it('should throw NotFoundException if movie not found', () => {
      try {
        service.getOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Movie with ID 999 not found.');
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const movieData: CreateMovieDto = {
        title: 'Test Movie',
        year: 2025,
        genres: ['test']
      };

      service.create(movieData);
      const movies = service.getAll();

      expect(movies).toHaveLength(1);
      expect(movies[0]).toEqual({
        id: 1,
        ...movieData
      });
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      // 먼저 영화를 생성
      service.create({
        title: 'Test Movie',
        year: 2025,
        genres: ['test']
      });

      const updateData: UpdateMovieDto = {
        title: 'Updated Test Movie',
        year: 2026
      };

      service.update(1, updateData);
      const movie = service.getOne(1);

      expect(movie.title).toBe(updateData.title);
      expect(movie.year).toBe(updateData.year);
      // genres는 업데이트하지 않았으므로 원래 값이 유지되어야 함
      expect(movie.genres).toEqual(['test']);
    });

    it('should throw NotFoundException if movie not found', () => {
      const updateData: UpdateMovieDto = { title: 'Updated Movie' };

      try {
        service.update(999, updateData);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Movie with ID 999 not found.');
      }
    });
  });

  describe('deleteOne', () => {
    it('should delete a movie', () => {
      // 먼저 영화를 생성
      service.create({
        title: 'Test Movie',
        year: 2025,
        genres: ['test']
      });

      const result = service.deleteOne(1);
      expect(result).toBe(true);

      // 삭제 확인
      expect(service.getAll()).toHaveLength(0);
    });

    it('should throw NotFoundException if movie not found', () => {
      try {
        service.deleteOne(999);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Movie with ID 999 not found.');
      }
    });
  });

  describe('search', () => {
    it('should find movies by year', () => {
      // 테스트용 영화들 생성
      service.create({
        title: 'Movie 2025',
        year: 2025,
        genres: ['test']
      });
      service.create({
        title: 'Movie 2026',
        year: 2026,
        genres: ['test']
      });

      const movies = service.search('2025');
      expect(movies).toHaveLength(1);
      expect(movies[0].title).toBe('Movie 2025');
    });

    it('should throw NotFoundException if no movies found for year', () => {
      try {
        service.search('1900');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Movie with year 1900 not found.');
      }
    });
  });
});
