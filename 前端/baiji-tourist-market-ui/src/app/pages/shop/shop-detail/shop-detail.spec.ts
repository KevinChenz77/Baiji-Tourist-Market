import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ShopDetail } from './shop-detail';

describe('ShopDetail', () => {
  let component: ShopDetail;
  let fixture: ComponentFixture<ShopDetail>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopDetail],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of(convertToParamMap({ number: '01' })) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopDetail);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('loads the shop matching the route number', () => {
    expect(component['shop']()?.name).toBe('自耕茶廠');
  });
});
