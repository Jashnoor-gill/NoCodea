import React from 'react';

const cards = [
  {
    badge: 'Low KMS',
    year: '2018',
    img: 'https://imageonthefly.autodatadirect.com/images/?USER=eDealer&PW=edealer872&IMG=USC80HOC011A021001.jpg&width=440&height=262',
    details: ['Used', '$28,000.00', '13000 Kms'],
    title: 'Honda Accord LX',
    link: '#',
  },
  {
    badge: 'Fully-Loaded',
    year: '2017',
    img: 'https://imageonthefly.autodatadirect.com/images/?USER=eDealer&PW=edealer872&IMG=CAC80HOC021B121001.jpg&width=440&height=262',
    details: ['Used', '$28,000.00', '13000 Kms'],
    title: 'Honda CIVIC HATCHBACK LS',
    link: '#',
  },
  {
    badge: 'Price Reduced',
    year: '2018',
    img: 'https://imageonthefly.autodatadirect.com/images/?USER=eDealer&PW=edealer872&IMG=USC80HOC091A021001.jpg&width=440&height=262',
    details: ['Used', '$22,000.00', '8000 Kms'],
    title: 'Honda Accord Hybrid LT',
    link: '#',
  },
];

export default function ProductCardsBlock() {
  return (
    <div className="container mx-auto my-8 px-4">
      <div className="flex flex-wrap -mx-2">
        {cards.map((card, idx) => (
          <div key={idx} className="w-full md:w-1/3 px-2 mb-6">
            <div className="relative bg-white rounded-lg shadow hover:shadow-xl transition-all duration-300 overflow-hidden group">
              <div className="relative">
                <span className="absolute left-2 top-2 bg-yellow-300 text-black rounded-full px-3 py-1 text-xs font-semibold z-10">{card.badge}</span>
                <span className="absolute right-2 top-2 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center text-xs font-semibold z-10">{card.year}</span>
                <img className="w-full h-48 object-cover" src={card.img} alt={card.title} />
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
                  {card.details.map((d, i) => (
                    <span key={i} className="bg-yellow-300 text-black rounded-full px-3 py-1 text-xs font-semibold">{d}</span>
                  ))}
                </div>
              </div>
              <div className="p-4 text-center">
                <div className="mb-2">
                  <h5 className="uppercase text-lg font-bold">{card.title}</h5>
                </div>
                <a
                  href={card.link}
                  className="inline-block uppercase w-36 h-10 rounded-full text-base font-semibold text-black bg-yellow-300 border-2 border-yellow-300 hover:bg-transparent hover:text-yellow-700 transition-all duration-300 mt-4 leading-10"
                >
                  View
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 