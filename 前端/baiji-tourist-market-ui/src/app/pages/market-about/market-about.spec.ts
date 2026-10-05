import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MarketAbout } from './market-about';

describe('MarketAbout', () => {
  let component: MarketAbout;
  let fixture: ComponentFixture<MarketAbout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MarketAbout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(MarketAbout);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
