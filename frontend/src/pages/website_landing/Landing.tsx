import { Link } from "react-router-dom";
import { ArrowRight, MessageSquare, Heart, Sparkles, Users } from "lucide-react";

export default function Landing() {
  return (
    <div className="bg-[#fdf9f4] text-[#1c1b19] font-sans selection:bg-[#c6e4f7] selection:text-[#001e2c] min-h-screen">
      {/* Premium Hero Section */}
      <section className="relative min-h-[750px] flex items-center overflow-hidden py-24">
        <div className="absolute inset-0 z-0">
          <div 
            className="w-full h-full bg-cover bg-center opacity-25"
            style={{ 
              backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuCbxPuYJmpDmtxv96Gr2bC3qVI2o5VeWaLbribxmRZNB6nxhm0YV39mzeCuRxRoe6kK8RMH08cUvE51eBY8QF2mAFSHPjOnE6p-qxmXY0J2E2GcQxboeQHatZjEi8psFLgjArY0Ko3BQJF-HrNRg0O9Soe3gbMISGUvP170RIrarSgScIrbVd9pMxCVfYV4DomTJsqPrT3ksrExli1PcHsbqr6Cy42s9sIMCWFQdiQiAsYSQ91Bpyjy')` 
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#fdf9f4]/10 via-[#fdf9f4]/60 to-[#fdf9f4]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 w-full">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-[#c6e4f7] text-[#2e4a5a] text-xs font-bold uppercase tracking-widest mb-6">
              Curated Theatrical Arts
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-[#1c1b19] mb-8 leading-[1.1] font-bold tracking-tight">
              The Stage <br />
              <span className="text-[#635f41] italic font-normal">Reimagined.</span>
            </h1>
            <p className="text-lg md:text-xl text-[#49473d] mb-10 max-w-xl leading-relaxed">
              Welcome to <strong className="text-[#635f41]">Aayam</strong>, where backstage discipline converges with spotlight prestige. We craft intellectual, inviting theatrical spaces for the modern cultural enthusiast.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/member" 
                className="bg-[#635f41] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#635f41]/90 active:scale-95 transition-all duration-300 flex items-center gap-2"
              >
                Join Aayam <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/profile" 
                className="border border-[#cac6b9] text-[#635f41] px-8 py-4 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#f1ede9] transition-all duration-300"
              >
                Explore Ensemble
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Spotlight Philosophy Section */}
      <section className="py-28 bg-[#f7f3ee] border-y border-[#cac6b9]/40">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
            <div className="lg:col-span-6 relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-[#cac6b9]">
                <img 
                  className="w-full h-full object-cover" 
                  alt="Minimalist theater stage under natural sun rays"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuk8WjtWLoR2TuUYyoLkZfAiEHid8OpAJtGE5o8KgkUUP9SoIVxVCzYPUxOcxUARV5rNNTqimtr-yH4S_al391d2kCLDjx_Q_n58n2hhlaJmVXFjOZ7lPJPF52PuaoLWDCKRIog2WrCYyWULP4S5hLFZtbOb2sSpYvNwaZfeItTA9n7q8k1j2nPyROKOvHzUR0DteXxwfD2g2DY1J_53sJ4wUh7yLnB-RYHHZ9imWiLFOmgvka5l0M"
                />
              </div>
              <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-[#fff9d2] p-6 rounded-xl border border-[#cac6b9] hidden md:flex flex-col justify-between shadow-md">
                <p className="font-serif text-5xl text-[#635f41] font-bold">12</p>
                <p className="text-xs font-bold text-[#767253] uppercase tracking-wider leading-snug">Active Productions This Season</p>
              </div>
            </div>
            
            <div className="lg:col-span-6 space-y-8">
              <h2 className="font-serif text-4xl md:text-5xl text-[#1c1b19] font-bold leading-tight tracking-tight">The Aayam Gallery Experience</h2>
              <div className="w-20 h-1 bg-[#466272] rounded-full"></div>
              <p className="text-lg text-[#49473d] leading-relaxed font-normal">
                Our philosophy centers on 'Visual Clarity.' We believe the space surrounding a performance is as vital as the performance itself. By blending minimalist design with the warmth of mid-day sun, we create environments where art can truly breathe.
              </p>
              <p className="text-base text-[#49473d]/90 leading-relaxed font-light">
                Whether you are a seasoned actor or a curious spectator, our venues offer a sanctuary for focused creativity. Every detail, from the acoustics of our venues to the interface of our community hub, is curated for excellence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Features */}
      <section className="py-32 bg-[#fdf9f4]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="text-center mb-24">
            <span className="text-xs font-bold text-[#466272] uppercase tracking-[0.25em] mb-4 block">Ecosystem of Artistry</span>
            <h2 className="font-serif text-4xl md:text-5xl text-[#1c1b19] font-bold tracking-tight">Backend Discipline. Spotlight Glory.</h2>
            <p className="text-lg text-[#49473d] max-w-2xl mx-auto mt-4 font-light">
              We coordinate creative talents, logistical resources, and patron contributions into a premium theater ecosystem.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Community Feed Card */}
            <div className="md:col-span-8 bg-[#fdf9f4] border border-[#cac6b9] rounded-2xl p-8 shadow-sm group hover:bg-[#e2fdff] transition-all duration-500 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <span className="inline-block p-4 rounded-xl bg-white border border-[#cac6b9]/40 mb-4 text-[#635f41]">
                      <Users className="w-8 h-8" />
                    </span>
                    <h3 className="font-serif text-2xl font-bold text-[#1c1b19]">Ensemble Hub</h3>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm p-3 rounded-full border border-[#cac6b9]">
                    <MessageSquare className="w-5 h-5 text-[#466272]" />
                  </div>
                </div>
                <p className="text-base text-[#49473d] mb-8 leading-relaxed font-light">
                  A vibrant social hub where the curtain never falls. Share blocking rehearsals, analyze classical scripts, and coordinate set designs in a workspace built for high-stakes art.
                </p>
              </div>
              <div className="flex items-center -space-x-3">
                <img 
                  className="w-10 h-10 rounded-full border-2 border-[#fdf9f4] object-cover" 
                  alt="Ensemble Member 1" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuATbMC775hHvfLLb9F3mVPtw4K2dw6bGMuAuAuNqBovs8EsF9N3G3_w8RYPIzK24kl4nL3A2DRk0sT2WMSGIR67XDJ7SOl5T5_KuNWq0NeIzlmTVsTRR4TC3aqN2-IxIimwn6aModCBNDR65E1xTAZoR_gM5_7rOL2lpXligIvYygov1cKDqNOK9M9K-IxYwoxrN-btwTvrc9pE9DM1hl-jltrWvaKlcKIkUQJ3C3BLPAG1rjHfjMRy"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-[#fdf9f4] object-cover" 
                  alt="Ensemble Member 2" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJU6LXfA5UBmKN98EP1oktLcJ-DHsnrG3kwrzahKHnJQ6O89JVRXI_pzoZDPdy3on-pRRqWz2q96hOq17zWsI38LhaXN5EIeeVpHgH8gZfl6SYf98FhTwIi6G3vh9r4OcrAflySxKVUCuwivvig35xbi1X0gitVRE7aMWrL5i2Uz1deLJymW9piEqmSU6UGg7M7ps7mPM7DiqnyYLZDWec9mqRI8AmNlVH5-7eIxR93EcIa6du1mq2"
                />
                <img 
                  className="w-10 h-10 rounded-full border-2 border-[#fdf9f4] object-cover" 
                  alt="Ensemble Member 3" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_Ub0gJyQxE_L2jw2PY8wLwCZX0_xCnlbsyrnyRlo4n4k9yVhom7BJcumpBkq2VCFSp47bMbs5dXy8hrrIA3ULMFjA1voymX_iT46RLx-DgYJy4GpXopBNGjBmO3XaD1l3xCSVR6nZKK4dyjhAQ1aja6J58X9chPm4j8a9vkXDJW6Z3XUrJWNhea4mCVnIOirh6KYHswBNAztiF7yhTUYrdHrwLmLndwsHx7geD076NU23zfDPmEhd"
                />
                <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-[#fdf9f4] bg-[#466272] text-white text-[10px] font-bold">
                  +400
                </div>
              </div>
            </div>

            {/* Support the Stage Card */}
            <div className="md:col-span-4 bg-[#fff9d2] border border-[#cac6b9] rounded-2xl p-8 shadow-sm flex flex-col justify-between">
              <div>
                <span className="inline-block p-4 rounded-xl bg-white border border-[#cac6b9]/40 mb-4 text-[#635f41]">
                  <Sparkles className="w-8 h-8" />
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1c1b19] mb-4">Patron Circle</h3>
                <p className="text-sm text-[#49473d] leading-relaxed font-light">
                  Your sponsorship fuels our seasonal plays. Help us maintain our architectural venue and empower theatrical talent.
                </p>
              </div>
              <button className="mt-8 flex items-center justify-between w-full p-4 border border-[#cac6b9] text-[#635f41] rounded-xl font-bold bg-white/20 hover:bg-white/50 transition-all">
                Become a Patron <Heart className="w-4 h-4 text-red-500 fill-red-500" />
              </button>
            </div>

            {/* Volunteer Actions Card */}
            <div className="md:col-span-12 bg-white border border-[#cac6b9] rounded-2xl p-8 md:p-12 shadow-sm flex flex-col md:flex-row items-center gap-12 group hover:bg-[#c6e4f7]/25 transition-all duration-500">
              <div className="flex-grow">
                <span className="inline-block p-4 rounded-xl bg-[#fdf9f4] border border-[#cac6b9]/40 mb-4 text-[#635f41]">
                  <Sparkles className="w-8 h-8" />
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#1c1b19] mb-4">Artistic Contribution</h3>
                <p className="text-base text-[#49473d] max-w-xl leading-relaxed font-light">
                  Contribute backstage or on center stage. From soundscapes to ushering, your passion shapes Aayam's visual and dramatic mastery.
                </p>
                <div className="mt-8 flex gap-3 flex-wrap">
                  <span className="px-4 py-2 bg-[#fdf9f4] rounded-full text-xs font-bold text-[#635f41] border border-[#cac6b9]">Costume Design</span>
                  <span className="px-4 py-2 bg-[#fdf9f4] rounded-full text-xs font-bold text-[#635f41] border border-[#cac6b9]">Lighting Direction</span>
                  <span className="px-4 py-2 bg-[#fdf9f4] rounded-full text-xs font-bold text-[#635f41] border border-[#cac6b9]">House Management</span>
                </div>
              </div>
              <div className="w-full md:w-64 h-64 rounded-xl overflow-hidden relative border border-[#cac6b9] flex-shrink-0">
                <img 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                  alt="Theater workshop setup"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3z6pEqHIVmyQdEqbmlRRMXVyiRc1z_kpgOpO51LwjrU9EWYzx-oqIgaPkBOEJZuInPLFJLKXs7KFPD49MQ3XJ6-NRrVAQUleAVxdoFJloZXowNrgindYj7j9ELtSb3VHuC283O1dvae53zV3CtaAgSVnmKY_F5_nzOGdgCM_LYCN8ctkh2VxR-fdPCb7Gdo70zZIxXYQZMTgrZ-xJ92cxlpNUTlbYdTf3_eW9PtjeFHTyEEULqWBk"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 px-6 md:px-12 bg-[#f7f3ee] border-t border-[#cac6b9]/40">
        <div className="max-w-7xl mx-auto bg-[#fff9d2] rounded-3xl p-12 md:p-24 relative overflow-hidden text-center border border-[#cac6b9]">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
            <Sparkles className="w-96 h-96 text-[#635f41]" />
          </div>
          <h2 className="font-serif text-4xl md:text-6xl text-[#767253] mb-8 font-bold relative z-10">Make Your Debut at Aayam</h2>
          <p className="text-lg text-[#767253]/90 mb-12 max-w-xl mx-auto relative z-10 font-light">
            Step under the spotlight. Become a member of the region's premier theatrical group and support high-contrast stagecraft.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center relative z-10">
            <button className="bg-[#635f41] text-white px-10 py-5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 transition-all duration-300">
              Join the Ensemble
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
