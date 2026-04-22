export const SUPPORTED_LANGUAGES = {
  zh: '中文',
  en: 'English'
};

export const dictionaries = {
  zh: {
    app: {
      parameterPanelAria: '轨道参数控制',
      sceneAria: '三维轨道场景',
      infoPanelAria: '派生信息与预设',
      eyebrow: 'Keplerian Elements',
      title: 'Satellite Orbit Explorer',
      subtitle: '前五个参数决定轨道，最后一个参数决定卫星此刻的位置。',
      language: '语言'
    },
    parametersHeading: '六个轨道要素',
    realtime: '实时更新',
    parameters: {
      a: {
        label: '半长轴',
        symbol: 'a',
        description: '控制轨道整体大小。',
        highlight: '轨道整体和近远地点会一起变大或变小。'
      },
      e: {
        label: '偏心率',
        symbol: 'e',
        description: '控制轨道从圆到椭圆的拉伸程度。',
        highlight: 'e 越大，近地点越近、远地点越远。'
      },
      iDeg: {
        label: '倾角',
        symbol: 'i',
        description: '控制轨道平面对赤道面的倾斜。',
        highlight: '轨道面会相对赤道面抬起。'
      },
      raanDeg: {
        label: '升交点赤经',
        symbol: 'Ω',
        description: '控制轨道平面绕地轴转到哪个方向。',
        highlight: '升交点线在赤道面内旋转。'
      },
      argPerigeeDeg: {
        label: '近地点幅角',
        symbol: 'ω',
        description: '控制椭圆在轨道平面内朝向哪里。',
        highlight: '近地点方向沿轨道平面旋转。'
      },
      trueAnomalyDeg: {
        label: '真近点角',
        symbol: 'ν',
        description: '控制卫星当前位于轨道上的哪个位置。',
        highlight: '卫星沿轨道移动，轨道本身不改变。'
      }
    },
    animation: {
      heading: '动画',
      statusKepler: '两体传播',
      statusFixed: '几何演示',
      modeAria: '动画模式',
      modes: {
        fixed: {
          label: '固定角速度',
          description: 'ν 匀速变化，便于观察几何。'
        },
        kepler: {
          label: '两体速度',
          description: '两体快慢 + 600x 时间压缩，非真实时钟。'
        }
      },
      play: 'Play',
      pause: 'Pause',
      reset: 'Reset ν',
      speed: '速度',
      formula: 'v = √(μ(2/r − 1/a))',
      formulaNote: '位置按开普勒方程推进；播放时间使用 600x 压缩。'
    },
    layers: {
      heading: '图层',
      subheading: '显示控制',
      showEarth: '地球',
      showEarthAxis: '地轴',
      showEquatorialPlane: '赤道面',
      showOrbitalPlane: '轨道面',
      showAxes: '坐标轴',
      showNodes: '升交点线',
      showPerigeeVector: '近远地点',
      showVelocityVector: '速度方向'
    },
    derived: {
      heading: '派生量',
      subheading: '两体近似',
      orbitTypeAria: '轨道类型',
      metrics: {
        rp: '近地点距离',
        hp: '近地点高度',
        ra: '远地点距离',
        ha: '远地点高度',
        periodSec: '轨道周期',
        r: '当前半径 r',
        speed: '当前速度 v',
        p: '半通径 p'
      },
      focusTitle: '轨道 vs. 卫星位置',
      focusBody: 'a/e/i/Ω/ω 定义轨道；ν 只移动当前卫星。'
    },
    orbitTags: {
      nearCircular: '近圆轨道',
      highEccentric: '高偏心椭圆',
      elliptic: '椭圆轨道',
      nearEquatorial: '近赤道轨道',
      nearPolar: '近极轨',
      intersectsEarth: '穿过地球'
    },
    warnings: {
      circularArgPerigee: 'e = 0 附近：圆轨道没有唯一近地点，ω 的几何意义退化。',
      equatorialRaan: 'i = 0 deg 或 180 deg 附近：轨道面与赤道面重合，Ω 的几何意义退化。',
      insideEarth: '近地点在地球内部：该轨道不是物理可行的卫星轨道。'
    },
    presets: {
      heading: 'Preset',
      subheading: '一键切换',
      items: {
        'leo-circular': {
          label: '低轨圆轨道',
          name: 'LEO circular',
          description: '低高度、近圆，常见于载人飞船和地球观测。'
        },
        eccentric: {
          label: '高偏心椭圆',
          name: 'High eccentric',
          description: '远地点明显拉长，近地点速度更快。'
        },
        polar: {
          label: '极轨',
          name: 'Polar orbit',
          description: '轨道面接近穿过南北极，适合全球覆盖。'
        },
        sso: {
          label: '太阳同步近似',
          name: 'Sun-sync approx',
          description: '用接近 98 deg 的倾角做教学展示，未加入 J2 摄动。'
        },
        geo: {
          label: '地球同步',
          name: 'GEO',
          description: '半长轴接近同步高度；圆且赤道时近似地静止。'
        },
        molniya: {
          label: 'Molniya 风格',
          name: 'Molniya style',
          description: '高椭圆、高倾角，适合展示远地点附近慢速停留。'
        }
      }
    },
    scene: {
      cameraAria: '相机视角',
      legendAria: '图例',
      defaultView: '默认透视',
      axisView: '沿地轴看',
      orbitView: '正看轨道面',
      nodeView: '沿升交点方向看',
      legend: {
        orbit: '轨道',
        equator: '赤道面',
        plane: '轨道面',
        perigee: '近地点'
      }
    }
  },
  en: {
    app: {
      parameterPanelAria: 'Orbit parameter controls',
      sceneAria: '3D orbit scene',
      infoPanelAria: 'Derived information and presets',
      eyebrow: 'Keplerian Elements',
      title: 'Satellite Orbit Explorer',
      subtitle: 'The first five elements define the orbit; the last one places the satellite on it.',
      language: 'Language'
    },
    parametersHeading: 'Six Orbital Elements',
    realtime: 'Live update',
    parameters: {
      a: {
        label: 'Semi-major axis',
        symbol: 'a',
        description: 'Sets the overall orbit size.',
        highlight: 'The whole orbit and apsides grow or shrink together.'
      },
      e: {
        label: 'Eccentricity',
        symbol: 'e',
        description: 'Controls how stretched the orbit is.',
        highlight: 'Higher e moves perigee inward and apogee outward.'
      },
      iDeg: {
        label: 'Inclination',
        symbol: 'i',
        description: 'Tilts the orbital plane relative to the equator.',
        highlight: 'The orbital plane lifts away from the equatorial plane.'
      },
      raanDeg: {
        label: 'RAAN',
        symbol: 'Ω',
        description: 'Rotates the orbital plane around Earth’s axis.',
        highlight: 'The node line rotates in the equatorial plane.'
      },
      argPerigeeDeg: {
        label: 'Argument of perigee',
        symbol: 'ω',
        description: 'Rotates the ellipse inside its orbital plane.',
        highlight: 'The perigee direction turns within the orbital plane.'
      },
      trueAnomalyDeg: {
        label: 'True anomaly',
        symbol: 'ν',
        description: 'Places the satellite at its current point on the orbit.',
        highlight: 'The satellite moves along the orbit; the orbit itself stays fixed.'
      }
    },
    animation: {
      heading: 'Animation',
      statusKepler: 'Two-body propagation',
      statusFixed: 'Geometry demo',
      modeAria: 'Animation mode',
      modes: {
        fixed: {
          label: 'Fixed angular rate',
          description: 'ν changes uniformly for geometric clarity.'
        },
        kepler: {
          label: 'Two-body speed',
          description: 'Two-body pacing + 600x time compression, not real clock time.'
        }
      },
      play: 'Play',
      pause: 'Pause',
      reset: 'Reset ν',
      speed: 'Speed',
      formula: 'v = √(μ(2/r − 1/a))',
      formulaNote: 'Position is advanced with Kepler’s equation; playback uses 600x time compression.'
    },
    layers: {
      heading: 'Layers',
      subheading: 'Visibility',
      showEarth: 'Earth',
      showEarthAxis: 'Earth axis',
      showEquatorialPlane: 'Equatorial plane',
      showOrbitalPlane: 'Orbital plane',
      showAxes: 'Axes',
      showNodes: 'Node line',
      showPerigeeVector: 'Apsides',
      showVelocityVector: 'Velocity'
    },
    derived: {
      heading: 'Derived Values',
      subheading: 'Two-body model',
      orbitTypeAria: 'Orbit type',
      metrics: {
        rp: 'Perigee radius',
        hp: 'Perigee altitude',
        ra: 'Apogee radius',
        ha: 'Apogee altitude',
        periodSec: 'Orbital period',
        r: 'Current radius r',
        speed: 'Current speed v',
        p: 'Semi-latus rectum p'
      },
      focusTitle: 'Orbit vs. Satellite Position',
      focusBody: 'a/e/i/Ω/ω define the orbit; ν only moves the satellite.'
    },
    orbitTags: {
      nearCircular: 'Near-circular',
      highEccentric: 'High eccentricity',
      elliptic: 'Elliptic orbit',
      nearEquatorial: 'Near-equatorial',
      nearPolar: 'Near-polar',
      intersectsEarth: 'Intersects Earth'
    },
    warnings: {
      circularArgPerigee: 'Near e = 0: a circular orbit has no unique perigee, so ω is geometrically degenerate.',
      equatorialRaan: 'Near i = 0 deg or 180 deg: the orbital and equatorial planes coincide, so Ω is geometrically degenerate.',
      insideEarth: 'Perigee is inside Earth: this is not a physically valid satellite orbit.'
    },
    presets: {
      heading: 'Presets',
      subheading: 'Quick switch',
      items: {
        'leo-circular': {
          label: 'LEO circular',
          name: 'Low Earth orbit',
          description: 'Low altitude and nearly circular; common for crewed spacecraft and Earth observation.'
        },
        eccentric: {
          label: 'High eccentric',
          name: 'Eccentric ellipse',
          description: 'A stretched orbit with much faster motion near perigee.'
        },
        polar: {
          label: 'Polar orbit',
          name: 'Polar orbit',
          description: 'The orbital plane passes near the poles, useful for global coverage.'
        },
        sso: {
          label: 'Sun-sync approx',
          name: 'Sun-synchronous style',
          description: 'A geometry-only 98 deg inclination example; J2 precession is not modeled.'
        },
        geo: {
          label: 'GEO',
          name: 'Geosynchronous orbit',
          description: 'Semi-major axis near synchronous altitude; circular and equatorial becomes geostationary.'
        },
        molniya: {
          label: 'Molniya style',
          name: 'Molniya-style orbit',
          description: 'High eccentricity and high inclination, useful for showing slow motion near apogee.'
        }
      }
    },
    scene: {
      cameraAria: 'Camera views',
      legendAria: 'Legend',
      defaultView: 'Default perspective',
      axisView: 'View along Earth axis',
      orbitView: 'View normal to orbital plane',
      nodeView: 'View along node line',
      legend: {
        orbit: 'Orbit',
        equator: 'Equator',
        plane: 'Orbital plane',
        perigee: 'Perigee'
      }
    }
  }
};
