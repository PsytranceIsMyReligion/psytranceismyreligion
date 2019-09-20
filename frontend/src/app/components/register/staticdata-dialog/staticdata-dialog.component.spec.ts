import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { StaticDataDialogComponent } from "./staticdata-dialog.component";

describe("StaticDataDialogComponent", () => {
  let component: StaticDataDialogComponent;
  let fixture: ComponentFixture<StaticDataDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaticDataDialogComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaticDataDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
