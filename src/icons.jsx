import {
  mdiAccountGroup,
  mdiAccountTie,
  mdiBank,
  mdiBarn,
  mdiBriefcaseAccount,
  mdiCashMultiple,
  mdiChartBoxOutline,
  mdiChartLine,
  mdiChevronDown,
  mdiCow,
  mdiDomain,
  mdiEarth,
  mdiFactory,
  mdiFinance,
  mdiOfficeBuilding,
  mdiScaleBalance,
  mdiShieldCheck,
  mdiShipWheel,
  mdiSilo,
  mdiSprout,
  mdiStorefrontOutline,
  mdiTrain,
  mdiTruckCargoContainer,
  mdiWarehouse,
  mdiWeatherNight,
  mdiWeatherSunny,
  mdiWeatherWindy,
} from "@mdi/js";

const ACTOR_ICONS = {
  "producer": mdiSprout,
  "country-elevator": mdiSilo,
  "terminal-elevator": mdiWarehouse,
  "trading-house": mdiDomain,
  "adm": mdiFactory,
  "bunge": mdiShipWheel,
  "ldc": mdiEarth,
  "processor": mdiFactory,
  "feeder": mdiCow,
  "exporter": mdiTruckCargoContainer,
  "speculator": mdiChartLine,
  "broker": mdiCashMultiple,
  "logistics": mdiTrain,
  "usda": mdiOfficeBuilding,
  "insurance": mdiShieldCheck,
  "lender": mdiBank,
};

const PERSONA_ICONS = {
  "trading-house-org": mdiDomain,
  risk: mdiScaleBalance,
  merchant: mdiBriefcaseAccount,
  originator: mdiAccountTie,
};

export function Icon({ path, size = 20, color = "currentColor", title }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      style={{ display: "block", flexShrink: 0, color }}
    >
      {title && <title>{title}</title>}
      <path fill="currentColor" d={path} />
    </svg>
  );
}

export function ActorIcon({ actor, size = 20, color = "currentColor" }) {
  return <Icon path={ACTOR_ICONS[actor.id] || mdiAccountGroup} size={size} color={color} />;
}

export function PersonaIcon({ persona, size = 20, color = "currentColor" }) {
  return <Icon path={PERSONA_ICONS[persona.id] || mdiBriefcaseAccount} size={size} color={color} />;
}

export const appIcons = {
  overview: mdiChartBoxOutline,
  roles: mdiAccountGroup,
  ecosystem: mdiSprout,
  dynamics: mdiWeatherWindy,
  light: mdiWeatherSunny,
  dark: mdiWeatherNight,
  chevron: mdiChevronDown,
  market: mdiFinance,
  store: mdiStorefrontOutline,
  barn: mdiBarn,
};
