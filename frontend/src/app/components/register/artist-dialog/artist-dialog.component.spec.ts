import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistDialogComponent } from './artist-dialog.component';

describe('ArtistDialogComponent', () => {
  let component: ArtistDialogComponent;
  let fixture: ComponentFixture<ArtistDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArtistDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
