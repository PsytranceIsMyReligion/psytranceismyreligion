import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WallService } from './wall.service';
import { environment } from './../../environments/environment';
import { WallPost } from '../models/member.model';

describe('WallService', () => {
  let service: WallService;
  let httpMock: HttpTestingController;
  const baseUri = environment.baseUri;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WallService]
    });
    service = TestBed.inject(WallService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getWallPosts', () => {
    it('should call get on the correct endpoint with default params', () => {
      const mockPosts = [{ id: '1', content: 'test' }];

      service.getWallPosts().subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(`${baseUri}/wallposts`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });

    it('should call get on the correct endpoint with provided config as params', () => {
      const mockPosts = [{ id: '1', content: 'test' }];
      const config = { page: '1', limit: '10' };

      service.getWallPosts(config).subscribe(posts => {
        expect(posts).toEqual(mockPosts);
      });

      const req = httpMock.expectOne(request =>
        request.url === `${baseUri}/wallposts` &&
        request.params.get('page') === '1' &&
        request.params.get('limit') === '10'
      );
      expect(req.request.method).toBe('GET');
      req.flush(mockPosts);
    });
  });

  describe('createWallPost', () => {
    it('should call post on the correct endpoint to create a wall post', () => {
      const newPost = { title: 'New Post', content: 'New Content' };
      const createdPost = { _id: '123', ...newPost };

      service.createWallPost(newPost).subscribe(post => {
        expect(post).toEqual(createdPost);
      });

      const req = httpMock.expectOne(`${baseUri}/wallposts/add`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPost);
      req.flush(createdPost);
    });
  });

  describe('updateWallPost', () => {
    it('should call post on the correct endpoint to update a wall post', () => {
      const postId = '123';
      const updateData: Partial<WallPost> = { content: 'Updated Content' };
      const updatedPost = { _id: postId, ...updateData };

      service.updateWallPost(postId, updateData as WallPost).subscribe(post => {
        expect(post).toEqual(updatedPost);
      });

      const req = httpMock.expectOne(`${baseUri}/wallposts/update/${postId}`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(updateData);
      req.flush(updatedPost);
    });
  });

  describe('deleteWallPost', () => {
    it('should call get on the correct endpoint to delete a wall post', () => {
      const postId = '123';
      const response = { success: true };

      service.deleteWallPost(postId).subscribe(res => {
        expect(res).toEqual(response);
      });

      const req = httpMock.expectOne(`${baseUri}/wallposts/delete/${postId}`);
      expect(req.request.method).toBe('GET');
      req.flush(response);
    });
  });
});
