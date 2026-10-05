import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hiking } from './hiking';

describe('Hiking', () => {
  let component: Hiking;
  let fixture: ComponentFixture<Hiking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hiking],
    }).compileComponents();

    fixture = TestBed.createComponent(Hiking);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
