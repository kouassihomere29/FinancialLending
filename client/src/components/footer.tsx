import { Coins, Facebook, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const footerSections = [
    {
      title: "Services",
      links: [
        { label: "Prêt personnel", href: "#" },
        { label: "Simulateur", href: "#calculator" },
        { label: "Rachat de crédit", href: "#" },
        { label: "Assurance", href: "#" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Centre d'aide", href: "#" },
        { label: "Contact", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Blog", href: "#" },
      ],
    },
    {
      title: "Légal",
      links: [
        { label: "Mentions légales", href: "#" },
        { label: "CGU", href: "#" },
        { label: "Confidentialité", href: "#" },
        { label: "Cookies", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#" },
    { icon: Twitter, href: "#" },
    { icon: Linkedin, href: "#" },
  ];

  return (
    <footer id="support" className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center mb-6">
              <Coins className="text-primary text-2xl mr-2" />
              <span className="text-xl font-bold">MoneyFlow</span>
            </div>
            <p className="text-gray-400 mb-6">
              Solution de prêt personnel simple, rapide et sécurisée.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const IconComponent = social.icon;
                return (
                  <a
                    key={index}
                    href={social.href}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>
          </div>
          
          {footerSections.map((section, index) => (
            <div key={index}>
              <h4 className="text-lg font-semibold mb-6">{section.title}</h4>
              <ul className="space-y-3 text-gray-400">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a
                      href={link.href}
                      className="hover:text-white transition-colors duration-200"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>
            &copy; 2024 MoneyFlow. Tous droits réservés. | Un crédit vous engage et doit être remboursé.
          </p>
        </div>
      </div>
    </footer>
  );
}
