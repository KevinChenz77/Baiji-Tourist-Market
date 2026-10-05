import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ShopList } from './shop-list';

describe('ShopList', () => {
  let component: ShopList;
  let fixture: ComponentFixture<ShopList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopList],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: { queryParamMap: of(convertToParamMap({})) },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('defaults to showing all shops', () => {
    expect(component['shops']().length).toBe(10);
  });
});
