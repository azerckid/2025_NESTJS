import { Test, TestingModule } from '@nestjs/testing';
import { MoviesController } from './movies.controller';
import { MoviesService } from './movies.service';
import { NotFoundException } from '@nestjs/common';

describe('MoviesController', () => {
  let controller: MoviesController;
  let service: MoviesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [MoviesService],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAll', () => {
    it('should return an empty array', () => {
      const result = controller.getAll();
      expect(result).toEqual([]);
    });
  });

  describe('getOne', () => {
    it('should throw NotFoundException when movie not found', () => {
      try {
        controller.getOne(1);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
        expect(e.message).toBe('Movie with ID 1 not found.');
      }
    });
  });

  describe('create', () => {
    it('should create a movie', () => {
      const movieData = {
        title: 'Test Movie',
        year: 2025,
        genres: ['Action', 'Adventure']
      };
      controller.create(movieData);
      const movies = controller.getAll();
      expect(movies).toHaveLength(1);
      expect(movies[0]).toEqual({
        id: 1,
        ...movieData
      });
    });
  });

  describe('update', () => {
    it('should update a movie', () => {
      // First create a movie
      const movieData = {
        title: 'Test Movie',
        year: 2025,
        genres: ['Action']
      };
      controller.create(movieData);

      // Then update it
      const updateData = { title: 'Updated Movie' };
      controller.patch(1, updateData);

      // Verify the update
      const movie = controller.getOne(1);
      expect(movie).toEqual({
        id: 1,
        ...movieData,
        ...updateData
      });
    });
  });

  describe('remove', () => {
    it('should delete a movie', () => {
      // First create a movie
      const movieData = {
        title: 'Test Movie',
        year: 2025,
        genres: ['Action']
      };
      controller.create(movieData);

      // Then delete it
      const result = controller.remove(1);
      expect(result).toBe(true);

      // Verify the deletion
      try {
        controller.getOne(1);
        fail('Should have thrown NotFoundException');
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }
    });
  });
});

