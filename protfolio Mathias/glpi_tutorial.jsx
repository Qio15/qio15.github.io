import { useState } from "react";

const chapters = [
  {
    id: 0,
    title: "Introduction",
    icon: "📋",
    content: [
      {
        type: "intro",
        text: "GLPI est une solution open-source de gestion de parc informatique et de service desk. C'est une application Full Web pour gérer l'ensemble de vos problématiques de gestion de parc informatique.",
      },
      {
        type: "features",
        title: "Fonctionnalités clés",
        items: [
          "Gestion et suivi des ressources informatiques",
          "Gestion et suivi des licences",
          "Gestion et suivi des consommables",
          "Base de connaissances",
          "Gestion des réservations",
          "Service Desk (helpdesk, SLA...)",
          "Inventaire automatisé",
          "Télé-déploiement",
        ],
      },
      {
        type: "features",
        title: "Avantages",
        items: [
          "Réduction des coûts",
          "Optimisation des ressources",
          "Gestion rigoureuse des licences",
          "Démarche qualité",
          "Satisfaction utilisateur",
          "Sécurité",
          "Diffusé sous licence libre GPL — gratuit",
        ],
      },
    ],
  },
  {
    id: 1,
    title: "Serveur LAMP",
    icon: "🖥️",
    content: [
      {
        type: "step",
        title: "a. Mise à jour de la distribution",
        commands: ["apt update && apt upgrade"],
      },
      {
        type: "step",
        title: "b. Renommer la machine",
        commands: ["hostnamectl set-hostname glpi"],
      },
      {
        type: "step",
        title: "c. Configuration réseau",
        text: "Ajouter une carte réseau sur un LAN segment, garder l'autre en NAT pour l'accès Internet.",
        commands: ["vim /etc/network/interfaces"],
        note: "Configurer ens36 en static avec l'adresse IP du LAN, puis activer la carte : ifup ens36",
      },
      {
        type: "step",
        title: "d. Installation Apache2, PHP et MariaDB",
        commands: ["apt install apache2 php mariadb-server -y"],
        note: "Vérifier le bon fonctionnement d'Apache avec systemctl status apache2. Tester PHP en créant une page phpinfo.php.",
      },
      {
        type: "step",
        title: "e. Sécurisation MariaDB",
        commands: ["mysql_secure_installation"],
        note: `Répondre aux questions :
• Switch to unix_socket : N
• Change root password : Y (mot de passe : root)
• Remove anonymous users : Y
• Disallow root login remotely : Y
• Remove test database : Y
• Reload privilege tables : Y`,
      },
    ],
  },
  {
    id: 2,
    title: "Installation GLPI",
    icon: "⚙️",
    content: [
      {
        type: "step",
        title: "a. Extensions PHP requises",
        commands: [
          "apt install php-{ldap,apcu,xmlrpc,mysql,mbstring,curl,gd,xml,intl,bz2,zip} -y",
          "systemctl restart apache2",
        ],
        note: `Extensions nécessaires : curl, fileinfo, gd, json, mbstring, mysqli, session, zlib, simplexml, xml, intl.
Configurer php.ini :
memory_limit = 64M
file_uploads = on
max_execution_time = 600
session.auto_start = off`,
      },
      {
        type: "step",
        title: "b. Création de la base de données",
        commands: [
          "mysql -u root",
          "CREATE DATABASE dbglpi;",
          "GRANT ALL PRIVILEGES ON dbglpi.* TO userglpi@'localhost' IDENTIFIED BY 'userglpi';",
          "FLUSH PRIVILEGES;",
        ],
      },
      {
        type: "step",
        title: "c. Téléchargement et installation",
        commands: [
          "mkdir tmp && cd tmp",
          "wget https://github.com/glpi-project/glpi/releases/download/10.0.5/glpi-10.0.5.tgz",
          "tar xzf glpi-10.0.5.tgz -C /var/www/html",
          "chown -R www-data:www-data /var/www/html/glpi",
          "chmod -R 775 /var/www/html/glpi/",
        ],
        note: "Activer session.cookie_httponly = on dans php.ini, puis accéder à http://votre_ip/glpi pour finaliser l'installation via l'interface web.",
      },
      {
        type: "info",
        title: "Identifiants par défaut après installation",
        items: [
          "glpi / glpi — Administrateur",
          "tech / tech — Technicien",
          "normal / normal — Utilisateur normal",
          "post-only / postonly — Post-only",
        ],
      },
    ],
  },
  {
    id: 3,
    title: "Sécurisation",
    icon: "🔒",
    content: [
      {
        type: "step",
        title: "a. Accès via nom de domaine",
        text: "Créer un enregistrement DNS de type A sur le serveur DNS, puis configurer un Virtual Host Apache.",
        commands: ["cd /etc/apache2/sites-available", "vim glpi.conf"],
        note: `Contenu du fichier glpi.conf :
<VirtualHost *:80>
  ServerName glpi.sitka.local
  DocumentRoot /var/www/glpi
</VirtualHost>`,
      },
      {
        type: "step",
        title: "b. Masquer version et OS",
        text: "Modifier /etc/apache2/conf-enabled/security.conf pour commenter les lignes suivantes :",
        commands: ["vim /etc/apache2/conf-enabled/security.conf"],
        note: "Commenter : ServerTokens OS → #ServerTokens OS\nCommenter : ServerSignature On → #ServerSignature On\npuis redémarrer Apache.",
      },
      {
        type: "step",
        title: "c. Sécurisation SSL",
        commands: [
          "apt install ssl-cert -y",
          "make-ssl-cert /usr/share/ssl-cert/ssleay.cnf /etc/ssl/private/sitka.pem",
          "a2enmod ssl",
          "a2ensite glpi.conf",
          "systemctl reload apache2",
        ],
        note: "Configurer le VirtualHost sur le port 443 avec SSLEngine on et SSLCertificateFile /etc/ssl/private/sitka.pem",
      },
    ],
  },
  {
    id: 4,
    title: "Active Directory",
    icon: "🗂️",
    content: [
      {
        type: "step",
        title: "a. Création de l'UO et des utilisateurs",
        text: "Sur le contrôleur de domaine, créer une Unité d'Organisation (ex : 'rh') contenant les utilisateurs à synchroniser (ex : kaiser, cesar).",
      },
      {
        type: "step",
        title: "b. Configuration LDAP dans GLPI",
        text: "Aller dans Configuration → Authentification → Annuaire LDAP → Ajouter",
        note: `Paramètres LDAP :
• Nom : hermes.sitka.local
• Serveur : 172.20.0.14 | Port : 389
• Filtre de connexion :
  (&(objectClass=user)(objectCategory=person)(!(userAccountControl:1.2.840.113556.1.4.803:=2)))
• BaseDN : OU=rh,DC=sitka,DC=local
• DN du compte : CN=Administrateur,CN=Users,DC=sitka,DC=local
• Champ identifiant : samaccountname
• Champ synchronisation : objectguid`,
      },
      {
        type: "step",
        title: "Importation des utilisateurs",
        text: "Administration → Utilisateurs → Liaison annuaire LDAP → Importation de nouveaux utilisateurs → Rechercher → Cocher → Action → Importer → Envoyer",
      },
    ],
  },
  {
    id: 5,
    title: "Tickets",
    icon: "🎫",
    content: [
      {
        type: "step",
        title: "a. Notification par mail",
        text: "Tester l'envoi SMTP via Telnet, puis configurer les notifications dans GLPI.",
        commands: ["telnet xmail.sitka.local 25"],
        note: `Dans GLPI : Configuration → Notifications
1. Activer le suivi
2. Activer les notifications par courriel
3. Configurer le serveur SMTP (mode SMTP, serveur xmail.sitka.local)
4. Renseigner le mail du compte glpi (support@xmail.sitka.local)`,
      },
      {
        type: "step",
        title: "b. Notification par collecteurs",
        text: "Les collecteurs créent des tickets automatiquement depuis les emails reçus.",
        note: `Configuration → Collecteurs → Ajouter :
• Nom : assistance@xmail.sitka.local
• Protocole : IMAP/SSL
• Serveur : xmail.sitka.local
• Port : 993

Pour collecter : Configuration → Actions automatiques → mailgate → Exécuter`,
      },
      {
        type: "step",
        title: "c. Gestion des tickets",
        text: "Les tickets peuvent être créés manuellement par les utilisateurs ou automatiquement via les collecteurs. L'administrateur est notifié par email à chaque nouveau ticket.",
      },
    ],
  },
  {
    id: 6,
    title: "FusionInventory",
    icon: "🔍",
    content: [
      {
        type: "step",
        title: "a. Installation du plugin",
        commands: [
          "wget https://github.com/fusioninventory/fusioninventory-for-glpi/releases/download/glpi10.0.3%2B1.0/fusioninventory-10.0.3+1.0.tar.bz2",
          "tar xvf fusioninventory-10.0.3+1.0.tar.bz2",
          "mv fusioninventory /var/www/glpi/plugins/",
        ],
        note: "Dans GLPI : Configuration → Plugins → Installer puis Activer FusionInventory",
      },
      {
        type: "step",
        title: "Configurer Cron",
        commands: ["crontab -u www-data -e"],
        note: "Ajouter à la fin du fichier cron :\n* * * * * cd /var/www/glpi/front/ && /usr/bin/php cron.php &>/dev/null\nPuis : /etc/init.d/cron restart",
      },
      {
        type: "step",
        title: "b. Agent FusionInventory Linux",
        commands: ["apt install fusioninventory-agent -y", "vim /etc/fusioninventory/agent.cfg"],
        note: "Dans agent.cfg, configurer :\nserver = https://glpi.sitka.local/plugins/fusioninventory/",
      },
      {
        type: "info",
        title: "Agent Windows",
        items: [
          "Télécharger fusioninventory-agent_windows-x64_2.6.exe sur GitHub",
          "Lancer l'installeur et sélectionner les composants souhaités",
          "Configurer l'URL du serveur GLPI lors de l'installation",
          "L'agent s'installe comme service Windows",
        ],
      },
    ],
  },
];

const glpiBlue = "#00bcd4";
const glpiDark = "#0d1b2a";
const glpiAccent = "#00e5ff";

export default function App() {
  const [currentPage, setCurrentPage] = useState("cover");
  const [activeChapter, setActiveChapter] = useState(0);

  if (currentPage === "cover") {
    return <CoverPage onStart={() => setCurrentPage("tutorial")} />;
  }

  return (
    <TutorialPage
      activeChapter={activeChapter}
      setActiveChapter={setActiveChapter}
      onBack={() => setCurrentPage("cover")}
    />
  );
}

function CoverPage({ onStart }) {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${glpiDark} 0%, #0a1628 40%, #0d2137 100%)`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(0,188,212,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,188,212,0.05) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "20%",
          left: "50%",
          transform: "translateX(-50%)",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,188,212,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 24px", maxWidth: 700 }}>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 12,
            background: "rgba(0,188,212,0.1)",
            border: "1px solid rgba(0,188,212,0.3)",
            borderRadius: 12,
            padding: "10px 24px",
            marginBottom: 40,
          }}
        >
          <span style={{ fontSize: 22 }}>🖥️</span>
          <span
            style={{
              color: glpiAccent,
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            Documentation Technique
          </span>
        </div>

        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            letterSpacing: -4,
            background: `linear-gradient(135deg, #fff 0%, ${glpiAccent} 60%, ${glpiBlue} 100%)`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 8,
            lineHeight: 1,
          }}
        >
          GLPI
        </div>
        <div
          style={{
            color: "rgba(255,255,255,0.4)",
            fontSize: 13,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 32,
          }}
        >
          Gestionnaire Libre de Parc Informatique
        </div>

        <div
          style={{
            color: "rgba(255,255,255,0.7)",
            fontSize: 18,
            lineHeight: 1.7,
            marginBottom: 48,
            maxWidth: 520,
            margin: "0 auto 48px",
          }}
        >
          Guide complet d'installation, configuration et sécurisation — du serveur LAMP à FusionInventory
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center", marginBottom: 56 }}>
          {chapters.map((ch) => (
            <div
              key={ch.id}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 20,
                padding: "6px 16px",
                color: "rgba(255,255,255,0.6)",
                fontSize: 12,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              <span>{ch.icon}</span> {ch.title}
            </div>
          ))}
        </div>

        <button
          onClick={onStart}
          style={{
            background: `linear-gradient(135deg, ${glpiBlue}, ${glpiAccent})`,
            color: "#000",
            fontWeight: 800,
            fontSize: 15,
            border: "none",
            borderRadius: 12,
            padding: "16px 48px",
            cursor: "pointer",
            letterSpacing: 1,
            textTransform: "uppercase",
            boxShadow: `0 0 40px rgba(0,188,212,0.4)`,
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "scale(1.05)";
            e.target.style.boxShadow = `0 0 60px rgba(0,188,212,0.6)`;
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow = `0 0 40px rgba(0,188,212,0.4)`;
          }}
        >
          Commencer le tutoriel →
        </button>

        <div style={{ marginTop: 20, color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          7 chapitres · Guide complet
        </div>
      </div>
    </div>
  );
}

function TutorialPage({ activeChapter, setActiveChapter, onBack }) {
  const chapter = chapters[activeChapter];

  return (
    <div style={{ minHeight: "100vh", background: "#0d1b2a", display: "flex", fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif" }}>
      <div
        style={{
          width: 260,
          flexShrink: 0,
          background: "#091422",
          borderRight: "1px solid rgba(0,188,212,0.1)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            padding: "24px 20px",
            borderBottom: "1px solid rgba(0,188,212,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: `linear-gradient(135deg, ${glpiBlue}, ${glpiAccent})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                color: "#000",
                fontSize: 14,
              }}
            >
              G
            </div>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 18 }}>GLPI</span>
          </div>
          <button
            onClick={onBack}
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.5)",
              borderRadius: 6,
              padding: "4px 10px",
              cursor: "pointer",
              fontSize: 11,
            }}
          >
            ← Accueil
          </button>
        </div>

        <nav style={{ padding: "16px 12px", flex: 1 }}>
          <div
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 10,
              letterSpacing: 2,
              textTransform: "uppercase",
              padding: "0 8px 12px",
            }}
          >
            Chapitres
          </div>
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => setActiveChapter(ch.id)}
              style={{
                width: "100%",
                textAlign: "left",
                border: "none",
                borderRadius: 8,
                padding: "10px 12px",
                cursor: "pointer",
                marginBottom: 4,
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: activeChapter === ch.id ? "rgba(0,188,212,0.15)" : "transparent",
                borderLeft: activeChapter === ch.id ? `3px solid ${glpiAccent}` : "3px solid transparent",
                color: activeChapter === ch.id ? "#fff" : "rgba(255,255,255,0.5)",
                fontWeight: activeChapter === ch.id ? 600 : 400,
                fontSize: 13,
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                if (activeChapter !== ch.id) e.currentTarget.style.background = "rgba(255,255,255,0.04)";
              }}
              onMouseLeave={(e) => {
                if (activeChapter !== ch.id) e.currentTarget.style.background = "transparent";
              }}
            >
              <span style={{ fontSize: 16 }}>{ch.icon}</span>
              <span>{ch.title}</span>
              {activeChapter === ch.id && <span style={{ marginLeft: "auto", color: glpiAccent, fontSize: 10 }}>●</span>}
            </button>
          ))}
        </nav>

        <div style={{ padding: "16px 20px", borderTop: "1px solid rgba(0,188,212,0.1)" }}>
          <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 10, marginBottom: 8 }}>
            PROGRESSION — {activeChapter + 1}/{chapters.length}
          </div>
          <div style={{ background: "rgba(255,255,255,0.08)", borderRadius: 4, height: 4 }}>
            <div
              style={{
                width: `${((activeChapter + 1) / chapters.length) * 100}%`,
                height: "100%",
                borderRadius: 4,
                background: `linear-gradient(90deg, ${glpiBlue}, ${glpiAccent})`,
                transition: "width 0.3s",
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "40px 48px", maxWidth: 860 }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "rgba(0,188,212,0.1)",
                border: `1px solid rgba(0,188,212,0.25)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
              }}
            >
              {chapter.icon}
            </div>
            <div>
              <div
                style={{
                  color: glpiAccent,
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: 2,
                  textTransform: "uppercase",
                  marginBottom: 4,
                }}
              >
                Chapitre {activeChapter + 1}
              </div>
              <h1 style={{ color: "#fff", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: -0.5 }}>
                {chapter.title}
              </h1>
            </div>
          </div>
          <div style={{ height: 1, background: "linear-gradient(90deg, rgba(0,188,212,0.4), transparent)" }} />
        </div>

        {chapter.content.map((block, i) => (
          <ContentBlock key={i} block={block} />
        ))}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 56,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <NavBtn onClick={() => setActiveChapter(Math.max(0, activeChapter - 1))} disabled={activeChapter === 0} label="← Précédent" />
          <NavBtn
            onClick={() => setActiveChapter(Math.min(chapters.length - 1, activeChapter + 1))}
            disabled={activeChapter === chapters.length - 1}
            label="Suivant →"
            primary
          />
        </div>
      </div>
    </div>
  );
}

function NavBtn({ onClick, disabled, label, primary }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        padding: "12px 28px",
        borderRadius: 10,
        fontWeight: 600,
        fontSize: 14,
        cursor: disabled ? "not-allowed" : "pointer",
        border: primary ? "none" : `1px solid rgba(0,188,212,0.3)`,
        background: disabled
          ? "rgba(255,255,255,0.04)"
          : primary
            ? `linear-gradient(135deg, ${glpiBlue}, ${glpiAccent})`
            : "rgba(0,188,212,0.08)",
        color: disabled ? "rgba(255,255,255,0.2)" : primary ? "#000" : glpiAccent,
        transition: "all 0.2s",
        opacity: disabled ? 0.4 : 1,
      }}
    >
      {label}
    </button>
  );
}

function ContentBlock({ block }) {
  if (block.type === "intro") {
    return (
      <div
        style={{
          background: "rgba(0,188,212,0.07)",
          border: "1px solid rgba(0,188,212,0.2)",
          borderRadius: 12,
          padding: "20px 24px",
          marginBottom: 24,
        }}
      >
        <p style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.8, margin: 0 }}>{block.text}</p>
      </div>
    );
  }

  if (block.type === "features") {
    return (
      <div style={{ marginBottom: 28 }}>
        <h3 style={{ color: "#fff", fontSize: 15, fontWeight: 700, marginBottom: 14 }}>{block.title}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {block.items.map((item, i) => (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                background: "rgba(255,255,255,0.03)",
                borderRadius: 8,
                padding: "10px 14px",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <span style={{ color: glpiAccent, fontSize: 12, marginTop: 2, flexShrink: 0 }}>✓</span>
              <span style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "info") {
    return (
      <div style={{ marginBottom: 28 }}>
        <div
          style={{
            background: "rgba(255,193,7,0.08)",
            border: "1px solid rgba(255,193,7,0.25)",
            borderRadius:  12,
            padding: "18px 22px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span>ℹ️</span>
            <span style={{ color: "#ffc107", fontWeight: 700, fontSize: 14 }}>{block.title}</span>
          </div>
          {block.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
              <span style={{ color: "#ffc107", fontSize: 12 }}>•</span>
              <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 13 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (block.type === "step") {
    return (
      <div
        style={{
          marginBottom: 28,
          background: "rgba(255,255,255,0.02)",
          border: "1px solid rgba(255,255,255,0.07)",
          borderRadius: 14,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: "14px 20px",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(0,188,212,0.06)",
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: glpiAccent, flexShrink: 0 }} />
          <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: 0 }}>{block.title}</h3>
        </div>
        <div style={{ padding: "16px 20px" }}>
          {block.text && (
            <p
              style={{
                color: "rgba(255,255,255,0.65)",
                fontSize: 13.5,
                lineHeight: 1.7,
                marginBottom: block.commands ? 14 : 0,
                marginTop: 0,
              }}
            >
              {block.text}
            </p>
          )}
          {block.commands &&
            block.commands.map((cmd, i) => (
              <div
                key={i}
                style={{
                  background: "#060e18",
                  border: "1px solid rgba(0,188,212,0.15)",
                  borderRadius: 8,
                  padding: "10px 16px",
                  marginBottom: 8,
                  fontFamily: "'Courier New', monospace",
                  fontSize: 12.5,
                  color: glpiAccent,
                  overflowX: "auto",
                }}
              >
                <span style={{ color: "rgba(0,188,212,0.4)", marginRight: 8 }}>#</span>
                {cmd}
              </div>
            ))}
          {block.note && (
            <div
              style={{
                marginTop: 12,
                background: "rgba(255,255,255,0.04)",
                borderLeft: `3px solid rgba(0,188,212,0.4)`,
                borderRadius: "0 8px 8px 0",
                padding: "12px 16px",
              }}
            >
              <div
                style={{
                  color: glpiAccent,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                Note
              </div>
              <pre
                style={{
                  color: "rgba(255,255,255,0.6)",
                  fontSize: 12.5,
                  lineHeight: 1.7,
                  margin: 0,
                  whiteSpace: "pre-wrap",
                  fontFamily: "inherit",
                }}
              >
                {block.note}
              </pre>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}

