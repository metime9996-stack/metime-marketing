
'use client';

const TEAM = [
  {
    name: 'Abdallah Mohamed',
    role: 'Founder & Performance Marketing Lead',
    image: '/team/member1.jpg',
  },
  {
    name: 'Salah',
    role: 'Motion Graphics & AI Specialist',
    image: '/team/member2.jpg',
  },
  {
    name: 'Shahd',
    role: 'HR & SEO Specialist',
    image: '/team/member3.jpg',
  },
  {
    name: 'Hazem',
    role: 'Graphic Designer & Social Media Manager',
    image: '/team/member4.jpg',
  },
];

function Card({ person, hidden = false }) {
  return (
    <div
      className="team-card group w-52 flex-shrink-0 text-center sm:w-60"
      aria-hidden={hidden || undefined}
    >
      {/* Image Container */}
      <div className="
        relative h-72 overflow-hidden rounded-2xl
        border border-[#D4AF37]/50
        bg-[#24143D]
        shadow-xl shadow-black/40
        transition-all duration-500
        group-hover:-translate-y-2
        group-hover:border-[#62BEC2]
        group-hover:shadow-[0_15px_40px_rgba(98,190,194,0.18)]
        sm:h-80
      ">

        {/* Background */}
        <div className="
          absolute inset-0 flex items-center justify-center
          bg-gradient-to-br from-[#3B235C] via-[#24143D] to-black
          text-7xl font-bold text-[#D4AF37]
        ">
          {person.name.charAt(0)}
        </div>

        {/* Team Photo */}
        <img
          src={person.image}
          alt={hidden ? '' : person.name}
          loading={hidden ? 'lazy' : 'eager'}
          decoding="async"
          draggable="false"
          className="
            absolute inset-0 z-10
            h-full w-full object-cover object-center
            transition-transform duration-700 ease-out
            group-hover:scale-110
          "
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }}
        />

        {/* Photo Overlay */}
        <div className="
          pointer-events-none absolute inset-0 z-20
          bg-gradient-to-t
          from-[#160D27]/90 via-transparent to-[#24143D]/10
          opacity-70 transition-opacity duration-500
          group-hover:opacity-90
        " />

        {/* Gold Accent */}
        <div className="
          pointer-events-none absolute bottom-0 left-0 right-0 z-30
          h-1 bg-gradient-to-r
          from-[#62BEC2] via-[#D4AF37] to-[#62BEC2]
          opacity-80
        " />

        {/* Cyan Corner Accent */}
        <div className="
          pointer-events-none absolute right-3 top-3 z-30
          h-3 w-3 rounded-full bg-[#62BEC2]
          shadow-[0_0_15px_rgba(98,190,194,0.8)]
        " />
      </div>

      {/* Name */}
      <p className="
        mt-4 text-lg font-bold tracking-wide text-white
        transition-colors duration-300
        group-hover:text-[#62BEC2]
      ">
        {person.name}
      </p>

      {/* Role */}
      <p className="
        mx-auto mt-1 max-w-[13rem]
        text-xs font-semibold leading-relaxed
        text-[#D4AF37]
      ">
        {person.role}
      </p>

    </div>
  );
}

export default function TeamMarquee({
  title = 'Meet The Team',
  speed = 40,
}) {
  const sets = [0, 1, 2, 3, 4, 5];

  return (
    <section className="
      relative w-full overflow-hidden
      bg-gradient-to-b from-[#24143D] via-[#190F29] to-black
      py-16 sm:py-20
    ">

      {/* Background Decoration */}
      <div className="
        pointer-events-none absolute left-1/2 top-0
        h-64 w-64 -translate-x-1/2 rounded-full
        bg-[#62BEC2]/10 blur-[100px]
      " />

      <div className="relative z-10">

        {/* Section Heading */}
        <div className="mb-3 text-center">

          <p className="
            mb-3 text-xs font-bold uppercase tracking-[0.4em]
            text-[#62BEC2]
          ">
            ME TIME CREATIVE TEAM
          </p>

          <h2 className="
            mx-auto w-fit border-b-2 border-[#D4AF37]
            pb-3 text-3xl font-bold text-white
            sm:text-4xl
          ">
            {title}
          </h2>

          <p className="
            mt-5 text-sm font-medium text-gray-300
          ">
            الناس اللي بتشتغل على نجاح براندك
          </p>

          <p className="
            mt-2 text-xs tracking-wide text-[#62BEC2]
          ">
            Creativity. Strategy. Real Growth.
          </p>

        </div>

        {/* Team Slider */}
        <div
          dir="ltr"
          className="team-wrap mt-12 overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
            maskImage:
              'linear-gradient(to right, transparent, black 7%, black 93%, transparent)',
          }}
        >

          <div
            className="team-track flex w-max gap-6 px-3 sm:gap-8"
            style={{
              animation: `teamMove ${speed}s linear infinite`,
            }}
          >
            {sets.map((set) =>
              TEAM.map((person, index) => (
                <Card
                  key={`${set}-${index}`}
                  person={person}
                  hidden={set > 0}
                />
              ))
            )}
          </div>

        </div>

        {/* Bottom Accent */}
        <div className="
          mx-auto mt-14 h-px w-40
          bg-gradient-to-r from-transparent
          via-[#D4AF37] to-transparent
        " />

      </div>

      <style jsx>{`
        @keyframes teamMove {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }

        .team-track:hover {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .team-track {
            animation: none !important;
          }

          .team-wrap {
            overflow-x: auto !important;
            -webkit-mask-image: none !important;
            mask-image: none !important;
          }
        }
      `}</style>

    </section>
  );
}
