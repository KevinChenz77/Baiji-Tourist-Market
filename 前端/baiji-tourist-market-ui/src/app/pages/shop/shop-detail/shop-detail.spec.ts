import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ShopDetail } from './shop-detail';

// jsdom 未實作 Element.part（CSS Shadow Parts），swiper 自訂元素初始化時會呼叫 part.add() 而噴錯，故補上最小 polyfill。
if (!('part' in Element.prototype)) {
  Object.defineProperty(Element.prototype, 'part', {
    configurable: true,
    get(this: Element & { _part?: Set<string> }) {
      if (!this._part) {
        this._part = new Set<string>();
      }
      return this._part;
    },
  });
}

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
