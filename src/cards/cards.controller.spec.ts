import { Test, TestingModule } from '@nestjs/testing';
import { CardsController } from './cards.controller';
import { CardsService } from './cards.service';
import { Cards } from './cards.schema';
import { HttpException } from '@nestjs/common';

describe('CardsController', () => {
  let cardsController: CardsController;
  let cardsService: CardsService;

  const mockCardsService = {
    generate: jest.fn(),
    create: jest.fn(),
    find: jest.fn(),
    findDecksByUser: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CardsController],
      providers: [
        {
          provide: CardsService,
          useValue: mockCardsService,
        },
      ],
    }).compile();

    cardsController = module.get<CardsController>(CardsController);
    cardsService = module.get<CardsService>(CardsService);
  });

  it('should be defined', () => {
    expect(cardsController).toBeDefined();
  });

  describe('generateCards', () => {
    it('should return generated cards', async () => {
      const result: Cards = {
        cardCommander: 'Soundwave, Superior Captain',
        cards: ['Card1', 'Card2'],
        userId: 'user-id-123',
      };
      mockCardsService.generate.mockResolvedValue(result);

      expect(await cardsController.generateCards()).toEqual(result);
    });

    it('should throw an error if generation fails', async () => {
      mockCardsService.generate.mockRejectedValue(new Error('Error'));

      await expect(cardsController.generateCards()).rejects.toThrow(HttpException);
    });
  });

  describe('create', () => {
    it('should create and return a deck', async () => {
      const deckToCreate: Cards = {
        cardCommander: 'Soundwave, Superior Captain',
        cards: ['Card1', 'Card2'],
        userId: 'user-id-123',
      };
      const req = { user: { userId: 'user-id-123' } };
      mockCardsService.generate.mockResolvedValue(deckToCreate);
      mockCardsService.create.mockResolvedValue(deckToCreate);

      expect(await cardsController.create(req)).toEqual(deckToCreate);
    });

    it('should throw an error if creation fails', async () => {
      const req = { user: { userId: 'user-id-123' } };
      mockCardsService.generate.mockResolvedValue({
        cardCommander: 'Soundwave, Superior Captain',
        cards: ['Card1', 'Card2'],
        userId: 'user-id-123',
      });
      mockCardsService.create.mockRejectedValue(new Error('Creation error'));

      await expect(cardsController.create(req)).rejects.toThrow(HttpException);
    });
  });

  describe('findCards', () => {
    it('should return found decks', async () => {
      const result: Cards[] = [
        {
          cardCommander: 'Commander One',
          cards: ['Card1', 'Card2'],
          userId: 'user-id-123',
        },
        {
          cardCommander: 'Commander Two',
          cards: ['Card3', 'Card4'],
          userId: 'user-id-456',
        },
      ];
      mockCardsService.find.mockResolvedValue(result);

      expect(await cardsController.findCards()).toEqual(result);
    });

    it('should throw an error if finding fails', async () => {
      mockCardsService.find.mockRejectedValue(new Error('Error'));

      await expect(cardsController.findCards()).rejects.toThrow(HttpException);
    });
  });

  describe('getMyDecks', () => {
    it('should return user decks', async () => {
      const result: Cards[] = [
        {
          cardCommander: 'My Commander',
          cards: ['Card1', 'Card2'],
          userId: 'user-id-123',
        },
        {
          cardCommander: 'My Second Commander',
          cards: ['Card3', 'Card4'],
          userId: 'user-id-123',
        },
      ];
      mockCardsService.findDecksByUser.mockResolvedValue(result);

      expect(await cardsController.getMyDecks()).toEqual(result);
    });
  });

  describe('importDeck', () => {
    it('should import and return the deck', async () => {
      const createCardsDto: Cards = {
        cardCommander: 'Imported Commander',
        cards: ['Card1', 'Card2'],
        userId: 'user-id-123',
      };
      const req = { user: { userId: 'user-id-123' } };
      mockCardsService.create.mockResolvedValue(createCardsDto);

      expect(await cardsController.importDeck(createCardsDto, req)).toEqual(createCardsDto);
    });

    it('should throw an error if import fails', async () => {
      const createCardsDto: Cards = {
        cardCommander: 'Imported Commander',
        cards: ['Card1', 'Card2'],
        userId: 'user-id-123',
      };
      const req = { user: { userId: 'user-id-123' } };
      mockCardsService.create.mockRejectedValue(new Error('Import error'));

      await expect(cardsController.importDeck(createCardsDto, req)).rejects.toThrow(HttpException);
    });
  });
});
