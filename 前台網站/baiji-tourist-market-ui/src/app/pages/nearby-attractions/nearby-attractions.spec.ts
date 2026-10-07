import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NearbyAttractions } from './nearby-attractions';

describe('NearbyAttractions', () => {
  let component: NearbyAttractions;
  let fixture: ComponentFixture<NearbyAttractions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyAttractions],
    }).compileComponents();

    fixture = TestBed.createComponent(NearbyAttractions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
